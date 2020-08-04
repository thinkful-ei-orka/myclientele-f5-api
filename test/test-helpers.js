const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  })
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  const testCompanies = makeCompanyArray();
  return db.transaction(async trx => {
    await seedCompanies(trx, testCompanies)
    await trx.into('users').insert(preppedUsers)
    await trx.raw(
      `SELECT setval('users_id_seq', ?)`,
      [users[users.length - 1].id],
  ) 
  })

}

function seedCompanies(db, companies) {
  return db.into('company').insert(companies)
    .then(() => 
      db.raw(
        `SELECT setval('company_id_seq', ?)`,
        [companies[companies.length - 1].id],
      )
    )
}

function makeCompanyArray() {
  return [
    {
      id: 1,
      name: 'Test company 1',
      location: 'Test location 1'
    },
    {
      id: 2,
      name: 'Test company 2',
      location: 'Test location 2'
    }
  ];
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

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`

}

module.exports = {
  makeKnexInstance,
  makeTestUsers,
  makeAuthHeader,
  seedUsers,
}