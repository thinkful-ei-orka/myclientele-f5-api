const path = require("path");
const express = require("express");
const ReportService = require("./report-service");
const { requireAuth } = require("../middleware/jwt-auth");
const ClientsService = require("../client/client-service");
const reportRouter = express.Router();
const jsonParser = express.json();

reportRouter
  .route("/")
  .all(requireAuth)
  .get(async (req, res, next) => {
    const currentUser = req.user.user_name;
    let queryString = req.originalUrl.split("?")[1];
    if (queryString) {
      let clientId = findClientId(queryString);
      if (clientId === -1) {
        //findClientId() returns -1 if the query string does not include a client_id or if the client id is not a number
        return res
          .status(400)
          .json({ error: "Query string must include a client_id and client_id must be a number" });
      }
      let client = await ClientsService.getClient(req.app.get('db'), Number(clientId));
      //before returning the reports by client id, we need to check to make sure that the client.sales_rep_id matches with the user id.  If these do not match, then we have an unauthorized request.
      if(client.sales_rep_id !== req.user.id) {
          return res.status(401).json({ error: 'Unauthorized request'})
      }
      ReportService.getReportsByClientId(
        req.app.get("db"),
        currentUser,
        clientId
      ).then((reports) => {
        res.json(ReportService.serializeReports(reports));
      });

    } else {
     //Hit this block if we do not have a query string
      ReportService.getAllReports(req.app.get("db"), currentUser)
        //returns all reports that corresponds to user_id
        .then((reports) => {
          res.json(ReportService.serializeReports(reports));
        });
    }
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
    ReportService.insertReport(
      req.app.get("db"), 
      newReport
      )
      .then((report) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${report.id}`))
          .json(report);
      })
      .catch(next);
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
  })
  .patch(jsonParser, (req, res, next) => {
    const { client_id, notes, photo_url } = req.body;
    const sales_rep_id = req.user.id;
    const reportToUpdate = { client_id, sales_rep_id, notes, photo_url };
    ReportService.getById(req.app.get("db"), req.params.id).then((report) => {
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
    });
    ReportService.updateReport(req.app.get("db"), req.params.id, reportToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ReportService.getById(req.app.get("db"), req.params.id).then((report) => {
      if (report.sales_rep_id !== req.user.id) {
        return res.status(401).json({ error: "Unathorized request" });
      }
    });
    ReportService.deleteReport(req.app.get("db"), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
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

function findClientId(str) {

  let sliceId = str.indexOf("client_id=");
  //find where the client_id starts in the query string
  if (sliceId === -1) { 
  //If we have a query string, but no client_id=, then return -1, telling the router to inform the user that we have a user error.
    return sliceId;
  }

  let sliceString = str;
  if (sliceId !== 0) {
  //remove everything in the query string that comes before "clientid="
    sliceString = str.slice(sliceId);
  }
  //remove "clientid="
  sliceString = sliceString.slice(10);
  let id = "";
  for (let i = 0; i < sliceString.length; i++) {
    //make sure that we are only returning the client_id, and nothing else from the query string.  So once we find the client id, we can break out of the for loop
    if (isNaN(Number(sliceString.charAt(i)))) {
      i = sliceString.length;
    } else {
      id += sliceString.charAt(i);
    }
    if(id === '') {
        id = -1;
    }
  }
  return id;
}

module.exports = reportRouter;
