const path = require("path");
const express = require("express");
const ReportService = require("./report-service");
const { requireAuth } = require("../middleware/jwt-auth");
const ClientsService = require("../client/client-service");
const PhotoService = require("../photo/photo-service");
const reportRouter = express.Router();
const jsonParser = express.json();

reportRouter
  .route("/")
  .all(requireAuth)
  .get(async (req, res, next) => {
    const currentUser = req.user.id;
    let reports;
    if (Object.keys(req.query).length !== 0 && req.query.client_id) {
      let client_id = req.query.client_id;
      if (isNaN(Number(client_id))) {
        return res.status(400).json({
          error:
            "Query string must include a client_id and client_id must be a number",
        });
      }
      let client = await ClientsService.getClient(
        req.app.get("db"),
        Number(client_id)
      );
      //before returning the reports by client id, we need to check to make sure that the client.sales_rep_id matches with the user id.  If these do not match, then we have an unauthorized request.
      if (client.sales_rep_id !== req.user.id) {
        //maybe move this into ClientsService.getClient()
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
      );
    }
    reports = await getPhotosForReports(req.app.get("db"), reports);
    res.json(ReportService.serializeReports(reports));
  })
  .post(jsonParser, async (req, res, next) => {
    const { client_id, notes, photos } = req.body;
    const sales_rep_id = req.user.id;
    const newReport = { client_id, sales_rep_id, notes };
    if (newReport.client_id == null) {
      return res.status(400).json({
        error: { message: "Missing 'client_id' in request body" },
      });
    }

    let report = await ReportService.insertReport(req.app.get("db"), newReport);
    if (photos) {
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
    if (report.sales_rep_id !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }
    report = await getPhotosForReports(req.app.get("db"), [report]);
    res.json([ReportService.serializeReport(report[0])]);
  })
  .patch(jsonParser, async (req, res, next) => {
    const { client_id, notes, photo_url } = req.body;
    const sales_rep_id = req.user.id;
    const reportToUpdate = { client_id, sales_rep_id, notes, photo_url };
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
        (report.photo_url === photo_url || !photo_url)
      ) {
        return res.status(400).json({
          error: {
            message: "Request body must contain notes or a photo_url",
          },
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
    const report = await ReportService.getById(
      req.app.get("db"),
      req.params.report_id
    );
    if (!report) {
      return res.status(404).json({
        error: { message: "Report does not exist" },
      });
    }
    res.report = report;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = reportRouter;
