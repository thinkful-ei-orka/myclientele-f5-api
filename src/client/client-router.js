const express = require('express')
const ClientsService = require('./client-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { post } = require('../app')

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
  // .post

module.exports = ClientsRouter;
