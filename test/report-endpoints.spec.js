const { expect } = require('chai');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');


describe('Reports Endpoints', () => {
    let db;
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db',db);
    });
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => helpers.cleanTables(db));
    afterEach('clean the table', () => helpers.cleanTables(db));

    const testUsers = helpers.makeTestUsers();
    const testCompanies = helpers.makeCompanyArray();
    const [testCompany] = testCompanies;
    const [testUser] = testUsers;
    const maliciousReport = helpers.maliciousReport;
    const newReport = helpers.newReport;
    const [testClients, testReports] = helpers.makeClientsAndReports(testUser);
    describe('Protected Endpoints', () => {
        beforeEach('insert reports', () => 
            helpers.seedUsersClientsReports(db, testUsers, testClients, testReports)
        );
        describe('Get /api/reports/:id', () => {
            it('responds with 401 missing bearer token when no bearer token', () => {
                return supertest(app)
                    .get('/api/reports/333')
                    .expect(401, {error: 'Missing bearer token'});
            });
            it('Responds with 401 when no credentials supplied', () => {
                const userNoCreds = { user_name: '', password: ''};
                return supertest(app)
                    .get('/api/reports/123')
                    .set('Authorization', helpers.makeAuthHeader(userNoCreds))
                    .expect(401, {error: 'Unauthorized request'});
            });
            it('Responds with 401 when invalid user_name', () => {
                const userInvalidCreds = { user_name: 'karen', password: 'manager'};
                return supertest(app)
                    .get('/api/reports/1')
                    .set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
                    .expect(401, {error: 'Unauthorized request'});
            });
        });
    });
    describe('GET /api/reports', () => {
        context('Given no reports', () => {
            beforeEach('seed users', () => 
                helpers.seedUsers(db, testUsers)
            );
            it('Responds with 200 and empty list', () => {
                return supertest(app)
                    .get('/api/reports')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, []);
            });
        });
        context('Given reports', () => {
            beforeEach('seed reports', () => 
                helpers.seedUsersClientsReports(db, testUsers, testClients, testReports)
            );
            it('responds with 200 and all reports the user has stored in the database', () => {
                const expectedReports = testReports.filter(report => report.sales_rep_id === testUsers[0].id);
                return supertest(app)
                    .get('/api/reports')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedReports);
            });
        });
    });
    describe('GET /api/reports/:id', () => {
        context('given no reports', () => {
            beforeEach(() => 
                helpers.seedUsers(db, testUsers)
            );

            it('responds with 404', () => {
                return supertest(app)
                    .get('/api/reports/2')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {error: {message: 'Report does not exist'}});
            });
        });
        context('given reports', () => {
            beforeEach('insert reports', () => 
                helpers.seedUsersClientsReports(db, testUsers, testClients, testReports)
            );
            it('responds with 200 and the specified report by Id', () => {
                const reportId = 1;
                const expectedReport = testReports[reportId - 1];
                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedReport);
            });
            it('responds with 401 when attempting to access an unauthorized report', () => {
                const reportId = testUsers[0].id + 1;
                return supertest(app)
                    .get(`/api/reports/${reportId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(401, {error: 'Unauthorized request'});
            });
        });
        context('Given an XSS attack report', () => {
            const testUser = testUsers[0];
            beforeEach('insert malicious game', () => 
                helpers.seedMaliciousReport(db, testUsers, testClients, maliciousReport)
            );
            it('Removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/reports/${maliciousReport.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200)
                    .expect(res => {
                        expect(res.body.photo_url).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
                        expect(res.body.notes).to.eql('Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.');
                    });
            });
        });
    });
    describe.only('POST /api/reports', () => {
        beforeEach(() => 
            helpers.seedUsers(db, testUsers)
        );
        it('creates a report, responding with 201 and the report', () => {
            return supertest(app)
            .post('/api/reports')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newReport)
        })
    });
});