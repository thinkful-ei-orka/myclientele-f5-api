const express = require("express");
const ClientsService = require("./client-service");
const { requireAuth } = require("../middleware/jwt-auth");
const path = require("path");
const UsersService = require("../users/users-service");
const CompaniesService = require("../companies/companies-service");

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
      lat,
      lng,
      day_of_week,
      hours_of_operation,
      currently_closed,
      notes,
      photo,
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
      lat,
      lng,
      day_of_week,
      hours_of_operation,
      currently_closed,
      notes,
      photo,
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
      photo,
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
      photo: photo,
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

ClientsRouter
  .route('/sales_rep_id/:id')
  .get(requireAuth, async (req, res, next) => {
    let sales_rep_id = req.params.id;
    let sales_rep = await UsersService.getUserContactInfo(req.app.get('db'), sales_rep_id);
    if(!sales_rep) {
      return res.status(400).json({error: 'Invalid employee'});
    }
    let user = req.user;
    if(sales_rep.company_id !== user.company_id) {
      return res.status(401).json({error: 'Unauthorized request'})
    }
    ClientsService.getClientsForUser(req.app.get("db"), sales_rep_id)
    .then((clients) => {
      const serializedClients = clients.map((client) =>
        ClientsService.serializeClient(client)
      );
      res.json({
        employee: sales_rep,
        clients: serializedClients
      });
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

ClientsRouter
  .route('/company/:id')
  .get(requireAuth, async (req, res, next) => {
    let company_id = req.params.id;
    let company = await CompaniesService.getCompany(req.app.get('db'), company_id)
    if(!company) {
      return res.status(400).json({error: 'Invalid company'});
    }
    let user = req.user;
    if(company.id !== user.company_id) {
      return res.status(401).json({error: 'Unauthorized request'})
    }
    ClientsService.getClientsByCompanyId(req.app.get("db"), company_id)
    .then((clients) => {
      const serializedClients = clients.map((client) =>
        ClientsService.serializeClient(client)
      );
      res.json({
        clients: serializedClients
      });
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

async function checkIfClientExists(req, res, next) {
  try {
    const client = await ClientsService.getClient(
      req.app.get("db"),
      req.params.client_id
    );
    if(!client) {
      return res.status(404).json({
        error: "Client does not exist" 
      });
    }
    else if(req.user.admin && req.user.company_id === client.company_id) {
      res.client = client;
      next();
    } else if (client.sales_rep_id !== req.user.id) {
      return res.status(404).json({
        error: "Client does not exist" 
      });
    } else {
      res.client = client;
      next();
    }
  } catch (error) {
    next(error);
  }
}


module.exports = ClientsRouter;
