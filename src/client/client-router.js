const express = require('express')
const ClientsService = require('./client-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const ClientsRouter = express.Router()
const jsonBodyParser = express.json()

ClientsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ClientsService.getClientsForUser(
      req.app.get('db'),
      req.user.id
    )
      .then(clients => {
        const serializedClients = clients.map(client => ClientsService.serializeClient(client))
        res.json(serializedClients)
      })
      .catch(err => {
        console.log(err)
        next()
      })
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name, location, company_id, day_of_week, hours_of_operation, currently_closed, notes, general_manager } = req.body
    const newClient = { name, location, company_id, day_of_week, hours_of_operation, currently_closed, notes, general_manager }

    newClient.id = req.id
    newClient.sales_rep_id = req.user.id

    ClientsService.insertClient(
      req.app.get('db'),
      newClient
    )
      .then(client => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${client.id}`))
          .json(ClientsService.serializeClient(client))
      })
  })

module.exports = ClientsRouter;

