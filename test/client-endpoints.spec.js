const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Client Endpoints', function() {
  let db

  const testUsers = helpers.makeTestUsers()
  const [testUser] = testUsers
  const [testClients, testReports] = helpers.makeClientsAndReports(testUser)

})