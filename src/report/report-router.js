const path = require("path");
const express = require("express");
const ReportService = require("./report-service");
const { requireAuth } = require("../middleware/jwt-auth");
const ClientsService = require("../client/client-service");
const PhotoService = require("../photo/photo-service");
const reportRouter = express.Router();
const UsersService = require("../users/users-service");
const jsonParser = express.json();

reportRouter
  .route("/")
  .all(requireAuth)
  .get(async (req, res, next) => {
    const currentUser = req.user.id;
    let reports;
    if (Object.keys(req.query).length !== 0 && req.query.client_id) {
    //If we have a query string and the query string includes a client id
      let client_id = req.query.client_id;
      if (isNaN(Number(client_id))) {
        return res.status(400).json({
          error:
            "Query string must include a client_id and client_id must be a number",
        })
      }
      let client = await ClientsService.getClient(
        req.app.get("db"),
        Number(client_id)
      );
      //before returning the reports by client id, we need to check to make sure that the client.sales_rep_id matches with the user id.  If these do not match, then we have an unauthorized request.
      if (client.sales_rep_id !== req.user.id) {
        return res.status(401).json({ error: "Unauthorized request" });
      }
      reports = await ReportService.getReportsByClientId(
        req.app.get("db"),
        client_id
      );
    } else {
      //Hit this block if we do not have a query string
      //returns all reports that corresponds to user_id
      reports = await ReportService.getAllReports(
        req.app.get("db"),
        currentUser
      )
    }
    //After getting the reports, we need to match the photos with each report.
    reports = await getPhotosForReports(req.app.get("db"), reports);
    res.json(ReportService.serializeReports(reports));
  })
  .post(jsonParser, async (req, res, next) => {
    const { client_id, notes, photos } = req.body;
    //If there are photos in the request body, these photos have already been uploaded to the S3 bucket, so "photos" is a list of URLs for the images.
    const sales_rep_id = req.user.id;
    const newReport = { client_id, sales_rep_id, notes };
    if (newReport.client_id == null) {
      return res.status(400).json({
        error: { message: "Missing 'client_id' in request body" },
      });
    }

    let report = await ReportService.insertReport(req.app.get("db"), newReport);
    if (photos) {
      //insert photos separate from the report.  Prep the photos for the photo table, then insert the photos
      let preppedPhotos = photos.map((photo) => {
        return {
          report_id: report.id,
          sales_rep_id: req.user.id,
          photo_url: photo,
        };
      });
      await PhotoService.insertPhotos(req.app.get("db"), preppedPhotos);
    }
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${report.id}`))
      .json(report);
  });

reportRouter
  .route("/:report_id")
  .all(requireAuth)
  .all(checkIfReportExists)
  .get(async (req, res, next) => {
    const user = req.user;
    let report = res.report;
    report = await getPhotosForReports(req.app.get("db"), [report]);
    res.json([ReportService.serializeReport(report[0])]);
  })
  .patch(jsonParser, async (req, res, next) => {
    const { client_id, notes, photos } = req.body;
    const sales_rep_id = req.user.id;
    const reportToUpdate = { client_id, sales_rep_id, notes, photos };
    try {
      let report = await ReportService.getById(
        req.app.get("db"),
        req.params.report_id
      );
      if (report.sales_rep_id !== req.user.id) {
        return res.status(401).json({ error: "Unauthorized request" });
      }
      if (
        (report.notes === notes || !notes) &&
        (report.photos === photos || !photos)
      ) {
        return res.status(400).json({
          error: {
            message: "Request body must contain notes or a photo_url",
          }
        });
      }
      await ReportService.updateReport(
        req.app.get("db"),
        req.params.report_id,
        reportToUpdate
      );
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      let report = await ReportService.getById(
        req.app.get("db"),
        req.params.report_id
      );
      if (report.sales_rep_id !== req.user.id) {
        return res.status(401).json({ error: "Unathorized request" });
      }
      await ReportService.deleteReport(req.app.get("db"), req.params.report_id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

reportRouter
  .route("/sales_rep_id/:id")
  //route is used for administrators to get all reports for a particular sales rep
  .get(requireAuth, async (req, res, next) => {
    let sales_rep_id = req.params.id;
    let sales_rep = await UsersService.getUserContactInfo(
      req.app.get("db"),
      sales_rep_id
    );
    if (!sales_rep) {
      return res.status(400).json({ error: "Invalid employee" });
    }
    let user = req.user;
    if (sales_rep.company_id !== user.company_id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }
    let reports = await ReportService.getAllReports(
      req.app.get("db"),
      sales_rep.id
    );
    reports = await getPhotosForReports(req.app.get("db"), reports);
    reports = ReportService.serializeReports(reports);
    res.json({
      employee: sales_rep,
      reports,
    });
  });

async function getPhotosForReports(db, reports) {
  let getPhotosByIdPromises = reports.map((report) => {
    return PhotoService.getPhotosByReportId(db, report.id);
  });
  let PhotosbyIds = await Promise.all(getPhotosByIdPromises);
  reports.forEach((report, index) => {
    reports[index].photos = PhotosbyIds[index];
  });

  return reports;
}

async function checkIfReportExists(req, res, next) {
  try {
    let client;
    const report = await ReportService.getById(
      req.app.get("db"),
      req.params.report_id
    );
    if (!report) {
      return res.status(404).json({
        error: { message: "Report does not exist" },
      });
    } else {
      client = await ClientsService.getClient(
        req.app.get("db"),
        report.client_id
      );
    }
    if (req.user.admin && req.user.company_id === client.company_id) {
      res.report = report;
      next();
    } else if (report.sales_rep_id !== req.user.id) {
      return res.status(401).json({
        error: "Unauthorized request",
      });
    } else {
      res.report = report;
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = reportRouter;
