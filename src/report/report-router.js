const path = require("path");
const express = require("express");
const ReportService = require("./report-service");
const { requireAuth } = require("../middleware/jwt-auth");
const ClientsService = require("../client/client-service");
const { query } = require("express");
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
      console.log("Getting all the reports by user");
      reports = await ReportService.getAllReports(req.app.get("db"), currentUser)
    }
    reports = await getPhotosForReports(req.app.get('db'), reports);
    res.json(ReportService.serializeReports(reports));
  })
  .post(jsonParser, (req, res, next) => {
    const { client_id, notes, photos } = req.body;
    const sales_rep_id = req.user.id;
    const newReport = { client_id, sales_rep_id, notes };
    if (newReport.client_id == null) {
      return res.status(400).json({
        error: { message: "Missing 'client_id' in request body" },
      });
    }

    ReportService.insertReport(req.app.get("db"), newReport).then((report) => {
      photos.forEach((photo) => {
        const newPhoto = {
          report_id: report.id,
          sales_rep_id: req.user.id,
          photo_url: photo,
        };
        PhotoService.insertPhoto(req.app.get("db"), newPhoto);
      });
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${report.id}`))
        .json(report);
    });
  });

reportRouter
  .route("/:report_id")
  .all(requireAuth)
  .all(checkIfReportExists)
  .get(async (req, res, next) => {
    console.log("id in report by id", req.params.report_id);
    const user = req.user;
    let report = await ReportService.getById(req.app.get("db"), req.params.report_id)
        if (report.sales_rep_id !== req.user.id) {
          return res.status(401).json({ error: "Unauthorized request" });
        }
    report = await getPhotosForReports(req.app.get('db'), [report]);
    res.json(report);

  })
  .patch(jsonParser, (req, res, next) => {
    const { client_id, notes, photo_url } = req.body;
    const sales_rep_id = req.user.id;
    const reportToUpdate = { client_id, sales_rep_id, notes, photo_url };
    ReportService.getById(req.app.get("db"), req.params.report_id).then(
      (report) => {
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
      }
    );
    ReportService.updateReport(
      req.app.get("db"),
      req.params.report_id,
      reportToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ReportService.getById(req.app.get("db"), req.params.report_id).then(
      (report) => {
        if (report.sales_rep_id !== req.user.id) {
          return res.status(401).json({ error: "Unathorized request" });
        }
      }
    );
    ReportService.deleteReport(req.app.get("db"), req.params.report_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });


async function getPhotosForReports(db, reports) {
  // if(typeof(reports) === 'object') {
  //   let photosByReportId = await PhotoService.getPhotosByReportId(db, reports.id);
  //   reports.photos = photosByReportId;
  // }
  let getPhotosByIdPromises = reports.map(report => {
    return PhotoService.getPhotosByReportId(db, report.id)
  })
  console.log(getPhotosByIdPromises, 'getPhotosByIdPromises')
  let PhotosbyIds = await Promise.all(getPhotosByIdPromises);
  reports.forEach((report, index) => {
    reports[index].photos = PhotosbyIds[index];
  })
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
