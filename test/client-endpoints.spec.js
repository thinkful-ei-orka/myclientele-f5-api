const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Client Endpoints', function() {
  let db

  const testUsers = helpers.makeTestUsers()
  const testCompanies = helpers.makeCompanyArray()
  const [testCompany] = testCompanies
  const [testUser] = testUsers
  const [testClients, testReports] = helpers.makeClientsAndReports(testUser)

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnet from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /api/clients', () => {
    

  })

})