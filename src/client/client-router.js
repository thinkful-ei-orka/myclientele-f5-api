const express = require("express");
const ClientsService = require("./client-service");
const { requireAuth } = require("../middleware/jwt-auth");
const path = require("path");

const ClientsRouter = express.Router();
const jsonBodyParser = express.json();

ClientsRouter.route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    ClientsService.getClientsForUser(req.app.get("db"), req.user.id)

      .then((clients) => {
        const serializedClients = clients.map((client) =>
          ClientsService.serializeClient(client)
        );
        res.json(serializedClients);
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {
      name,
      location,
      day_of_week,
      hours_of_operation,
      currently_closed,
      notes,
      general_manager,
    } = req.body;

    const requiredFields = {
      name,
      location,
      hours_of_operation,
      currently_closed,
    };
    const newClient = {
      name,
      location,
      day_of_week,
      hours_of_operation,
      currently_closed,
      notes,
      general_manager,
    };

    for (const [key, value] of Object.entries(requiredFields))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    newClient.sales_rep_id = req.user.id;
    newClient.company_id = req.user.company_id;


    ClientsService.insertClient(req.app.get("db"), newClient)
      .then((client) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${client.id}`))
          .json(ClientsService.serializeClient(client));
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  });

ClientsRouter.route("/:client_id")
  .all(requireAuth)
  .all(checkIfClientExists)
  .get((req, res, next) => {
    res.json(ClientsService.serializeClient(res.client));
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const {
      name,
      location,
      day_of_week,
      hours_of_operation,
      currently_closed,
      notes,
      general_manager,
    } = req.body;
    const clientToUpdate = {
      id: Number(req.params.client_id),
      name: name,
      location: location,
      sales_rep_id: req.user.id,
      company_id: req.user.company_id,
      hours_of_operation: hours_of_operation,
      currently_closed: currently_closed,
      general_manager: general_manager,
      notes: notes,
      day_of_week: day_of_week,
    };

    return ClientsService.updateClient(
      req.app.get("db"),
      Number(req.params.client_id),
      clientToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    ClientsService.deleteClient(req.app.get("db"), req.params.client_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkIfClientExists(req, res, next) {
  try {
    const client = await ClientsService.getClient(
      req.app.get("db"),
      req.params.client_id
    );
    if (!client || client.sales_rep_id !== req.user.id) {
      return res.status(404).json({
        error: { message: "Client does not exist" },
      });
    }
    res.client = client;
    next();
  } catch (error) {
    next(error);
  }
}


module.exports = ClientsRouter;
