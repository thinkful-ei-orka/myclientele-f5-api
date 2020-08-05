const app = require('../src/app');
const helpers = require('./test-helpers');
const knex = require('knex');
const supertest = require('supertest');

describe.only('Client Endpoints', function () {
    let db;

    const testUsers = helpers.makeTestUsers();
    const testCompanies = helpers.makeCompanyArray();
    const [testCompany] = testCompanies;
    const [testUser] = testUsers;
    const [testClients, testReports] = helpers.makeClientsAndReports(testUser);

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnet from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('GET /api/clients', () => {
        context('given clients exist', () => {
            beforeEach('insert clients', () => {
                return helpers.seedClientsTables(db, testUsers, testClients);
            });
            it('should respond with 200 and the clients', () => {
                const expectedClient = testClients[0];
                return supertest(app)
                  .get('/api/clients')
                  .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                  .expect(200, expectedClient);
            });
        });
    });
});
