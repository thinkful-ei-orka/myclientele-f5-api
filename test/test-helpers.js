const knex = require('knex')
const bcrypt = require('bcrypt.js')
const jwt = require('jsonwebtoken')

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  })
}

function makeTestUsers() {
  return [
    {
      id: 1,
      name: 'test-user-1',
      user_name: 'test-user-name-1',
      password: 'password',
      company_id: 1,
      admin: true
    },
    {
      id: 2,
      name: 'test-user-2',
      user_name: 'test-user-name-2',
      password: 'password',
      company_id: 2,
      admin: true
    }
  ]
}

function makeAuthHeader() {

}

