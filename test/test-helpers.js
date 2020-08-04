const knex = require('knex')
const bcrypt = require('bcrypt.js')
const jwt = require('jsonwebtoken')

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  })
}

function makeUsersArray() {
  return [
    {
      id: 1,
      
    }
  ]
}