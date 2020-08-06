const path = require("path");
const express = require("express");
const ReportService = require("./report-service");
const { requireAuth } = require("../middleware/jwt-auth");
const reportRouter = express.Router();
const jsonParser = express.json();

reportRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    const currentUser = req.user.user_name;
    ReportService.getAllReports(req.app.get("db"), currentUser)
      //returns all reports that corresponds to user_id
      .then((reports) => {
        res.json(ReportService.serializeReports(reports));
      });
  })
  .post(jsonParser, (req, res, next) => {
    const { client_id, notes, photo_url } = req.body;
    const sales_rep_id = req.user.id;
    const newReport = { client_id, sales_rep_id, notes, photo_url };
    if (newReport.client_id == null) {
      return res.status(400).json({
        error: { message: "Missing 'client_id' in request body" },
      });
    }
    ReportService.insertReport(req.app.get("db"), newReport).then((report) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${report.id}`))
        .json(report);
    });
  });

reportRouter
  .route("/:id")
  .all(requireAuth)
  .all(checkIfReportExists)
  .get((req, res, next) => {
    ReportService.getById(req.app.get("db"), req.params.id).then((report) => {
      if (report.sales_rep_id !== req.user.id) {
        console.log("stopping line 28");
        return res.status(401).json({ error: "Unauthorized request" });
      }
      res.json(ReportService.serializeReport(report));
    });
  });

async function checkIfReportExists(req, res, next) {
  try {
    const report = await ReportService.getById(
      req.app.get("db"),
      req.params.id
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
