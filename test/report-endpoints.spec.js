const { expect } = require('chai');
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const supertest = require('supertest');
const helpers = require('./test-helpers');

describe.only('Reports Endpoints', () => {
    let db;
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
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
                    .expect(401, { error: 'Missing bearer token' });
            });
            it('Responds with 401 when no credentials supplied', () => {
                const userNoCreds = { user_name: '', password: '' };
                return supertest(app)
                    .get('/api/reports/123')
                    .set('Authorization', helpers.makeAuthHeader(userNoCreds))
                    .expect(401, { error: 'Unauthorized request' });
            });
            it('Responds with 401 when invalid user_name', () => {
                const userInvalidCreds = { user_name: 'karen', password: 'manager' };
                return supertest(app)
                    .get('/api/reports/1')
                    .set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
                    .expect(401, { error: 'Unauthorized request' });
            });
        });
    });
    describe.only('GET /api/reports', () => {
        context('Given no reports', () => {
            beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
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
                const expectedReports = testReports.filter(
                    (report) => report.sales_rep_id === testUsers[0].id
                );
                return supertest(app)
                    .get('/api/reports')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedReports);
            });
            it('responds with 200 and all reports for a given client', () => {
                const expectedReports = testReports.filter(
                    (report) => report.sales_rep_id === testUsers[0].id
                );
                const clientId = testClients[0].id;
                return supertest(app)
                    .get(`/api/reports?client_id=${clientId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedReports);
            })
            it('responds with 400 given invalid query string', () => {
                return supertest(app)
                    .get('/api/reports?irrelevantfield=foo')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, {error: 'Query string must include a client_id and client_id must be a number'})
            })
            it('responds with 400 when user inputs an invalid client_id', () => {
                return supertest(app)
                    .get('/api/reports?client_id=bad')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(400, {error: 'Query string must include a client_id and client_id must be a number'})
            })
            it('responds with 401 when trying to access unauthorized reports by id', () => {
                return supertest(app)
                    .get('/api/reports?client_id=1')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(401, { error: 'Unauthorized request'});
            });
        });
    });
    describe('GET /api/reports/:id', () => {
        context('given no reports', () => {
            beforeEach(() => helpers.seedUsers(db, testUsers));

            it('responds with 404', () => {
                return supertest(app)
                    .get('/api/reports/2')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: 'Report does not exist' } });
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
                    .expect(401, { error: 'Unauthorized request' });
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
                    .expect((res) => {
                        expect(res.body.photo_url).to.eql(
                            'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
                        );
                        expect(res.body.notes).to.eql(
                            'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.'
                        );
                    });
            });
        });
    });
    describe('POST /api/reports', () => {
        beforeEach(() => helpers.seedClientsTables(db, testUsers, testClients));
        it('creates a report, responding with 201 and the report', () => {
            return supertest(app)
                .post('/api/reports')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newReport)
                .expect(201)
                .expect((res) => {
                    expect(res.body.client_id).to.eql(newReport.client_id);
                    expect(res.body.sales_rep_id).to.eql(testUsers[0].id);
                    expect(res.body.notes).to.eql(newReport.notes);
                    expect(res.body.photo_url).to.eql(newReport.photo_url);
                    expect(res.headers.location).to.eql(`/api/reports/${res.body.id}`);
                })
                .then((postRes) => {
                    return supertest(app)
                        .get(`/api/reports/${postRes.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(postRes.body);
                });
        });
        const testNewReport = {
            client_id: 1,
            sales_rep_id: 1,
            date: '2016-06-23T02:10:25.000Z',
            notes: 'test notes',
            photo_url: 'test new photo',
        };
        it('responds with 400 and an error message when client_id is missing', () => {
            delete testNewReport['client_id'];
            return supertest(app)
                .post('/api/reports')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(testNewReport)
                .expect(400, {
                    error: { message: "Missing 'client_id' in request body" }
                });
        });
    });
    describe('PATCH /api/reports/:id', () => {
        context('Given no reports', () => {
            beforeEach(() => 
                helpers.seedUsers(db, testUsers)
            );
            it('responds with a 404', () => {
                return supertest(app)
                    .patch(`/api/reports/342`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, {error: {message: 'Report does not exist'}}
                    );
            });
        });
        context('Given reports in the database', () => {
            beforeEach(() => 
                helpers.seedUsersClientsReports(db, testUsers, testClients, testReports)
            );
            it('responds with 204 and updates the game', () => {
                const idToUpdate = 1;
                const updateReport = {
                    notes: 'new notes',
                    photo_url: 'new photo url'
                };
                const expectedReport = {
                    ...testReports[idToUpdate - 1],
                    ...updateReport
                };
                return supertest(app)
                    .patch(`/api/reports/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(updateReport)
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get(`/api/reports/${idToUpdate}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedReport);
                    })    
            });
            it('responds with 400 when no required fields supplied', () => {
                const idToUpdate = 1;
                return supertest(app)
                    .patch(`/api/reports/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send({irrelevantField: 'foo'})
                    .expect(400, {
                        error: {
                            message: 'Request body must contain notes or a photo_url'
                        }
                    })
            });
        });
    });
    describe('DELETE /api/reports/:id', () => {
        context('Given reports', () => {
            beforeEach(() => 
                helpers.seedUsersClientsReports(db, testUsers, testClients, testReports)
            )
            it('responds with a 204 and removes report', () => {
                const idToRemove = testReports[0].id;
                const expectedReports = testReports.filter(report => report.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/reports/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/reports')
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedReports);
                    })
            })
        })
    })
});
