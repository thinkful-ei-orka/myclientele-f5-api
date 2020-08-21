const app = require('../src/app');
const helpers = require('./test-helpers');
const knex = require('knex');
const supertest = require('supertest');

describe('Company Endpoints', function() {
    let db;

    const testCompanies = helpers.makeCompanyArray();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnet from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));
  
    describe('GET /api/companies/:company_id', () => {
        context('given companies exist', () => {
            beforeEach('insert companies', () => {
                return helpers.seedCompanies(
                    db,
                    testCompanies
                );
            });

            it('should respond with 200 and the company', () => {
                const expectedCompany = testCompanies[0];
                return supertest(app)
                    .get('/api/companies/1')
                    .expect(200, expectedCompany);
            });
        });

        context('given company does not exist', () => {
            it('should respond with 404 \'Company doesn\'t exist\'', () => {
                return supertest(app)
                    .get('/api/companies/4')
                    .expect(404, { error: {message:  'Company doesn\'t exist'} });
            });
        });
    });

});