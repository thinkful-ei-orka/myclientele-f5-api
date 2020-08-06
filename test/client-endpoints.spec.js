const app = require('../src/app');
const helpers = require('./test-helpers');
const knex = require('knex');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Client Endpoints', function () {
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
        const expectedClient = testClients;
        return supertest(app)
          .get('/api/clients')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedClient);
      });
    });
  });

  describe('POST /api/clients', () => {
    beforeEach('insert clients', () => {
      return helpers.seedUsers(db, testUsers);
    });
    it('creates client, res of 201 and new client', () => {
      const testUser = testUsers[0];
      const newClient = {
        name: 'test-client-3',
        location: 'test-location-3',
        sales_rep_id: testUser.id,
        company_id: testUser.company_id,
        hours_of_operation: 'Mo-Su',
        currently_closed: false,
        general_manager: 'test-gm-3',
        notes: 'test notes 3',
        day_of_week: 2
      };
      return supertest(app)
        .post('/api/clients')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newClient)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.name).to.eql(newClient.name);
          expect(res.body.location).to.eql(newClient.location);
          expect(res.body.sales_rep_id).to.eql(newClient.sales_rep_id);
          expect(res.body.company_id).to.eql(newClient.company_id);
          expect(res.body.hours_of_operation).to.eql(newClient.hours_of_operation);
          expect(res.body.currently_closed).to.eql(newClient.currently_closed);
          expect(res.body.general_manager).to.eql(newClient.general_manager);
          expect(res.body.notes).to.eql(newClient.notes);
          expect(res.body.day_of_week).to.eql(newClient.day_of_week);
        })
        .expect(res => 
          db
            .from('client')
            .select('*')
            .where({ id: res.body.id })  
            .first()
            .then(row => {
              expect(row.name).to.eql(newClient.name);
              expect(row.location).to.eql(newClient.location);
              expect(row.sales_rep_id).to.eql(newClient.sales_rep_id);
              expect(row.company_id).to.eql(newClient.company_id);
              expect(row.hours_of_operation).to.eql(newClient.hours_of_operation);
              expect(row.currently_closed).to.eql(newClient.currently_closed);
              expect(row.general_manager).to.eql(newClient.general_manager);
              expect(row.notes).to.eql(newClient.notes);
              expect(row.day_of_week).to.eql(newClient.day_of_week);
            })
        );
    });

    const requiredFields = ['name', 'location', 'hours_of_operation', 'currently_closed'];

    requiredFields.forEach(field => {
      const testUser = testUsers[0];
      const newClient = {
        name: 'test-client-3',
        location: 'test-location-3',
        sales_rep_id: testUser.id,
        company_id: testUser.company_id,
        hours_of_operation: 'Mo-Su',
        currently_closed: false,
        general_manager: 'test-gm-3',
        notes: 'test notes 3',
        day_of_week: 2
      };

      it(`responds with 400 and an err msg with the '${field}' is missing`, () => {
        delete newClient[field];

        return supertest(app)
          .post('/api/clients')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newClient)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });

  });

  describe('PATCH /api/clients/:client_id', () => {
    context('Given no client', () => {
      it('should respond with 404', () => {
        const clientId = 12345678;
        return supertest(app)
          .patch(`/api/clients/${clientId}`)
          .expect(404, { error: { message: `Client doesn't exist` } });
      })
    });

    context('Give clients in DB' , () => {
      const testClients = helpers.makeClients()

      beforeEach('insert clients', () => {
        return helpers.seedClientsTables(
          db,
          testUsers,
          testClients
        )
      })

      it('responds with 204 and updates the client', () => {
        const idToUpdate = 2;
        const updateClient = {
          name: 'updated name',
          location: 'updated location',
          day_of_week: 4,
          hours_of_operation: 'Mo-Fr',
          currently_closed: true,
          notes: 'seems to be going downhill',
          general_manager: 'different gm'
        }
        const expectedClient = { 
          ...testClients[idToUpdate-1],
          ...updateClient
        }

        return supertest(app)
          .patch(`/api/clients/${idToUpdate}`)
          .send(updateClient)
          .expect(204)
          .then(res => 
            supertest(app)
              .get(`/api/clients/${idToUpdate}`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(expectedClient)  
          )
      })
    })
  });

  describe('DELETE /api/clients/:client_id', () => {
    context('Given no clients', () => {
      it('responds with 404', () => {
        const clientId = 12345678
        return supertest(app)
          .delete(`/api/clients/${clientId}`)
          .expect(404, { error: { message: `Client doesn't exist` } })
      })
    })

    context('Given there are clients in DB', () => {
      const testClients = helpers.makeClients()

      beforeEach('insert clients', () => {
        return helpers.seedClientsTables(
          db,
          testUsers,
          testClients
        )
      })

      it('responds with 204 and removes client', () => {
        const idToRemove = 2
        const expectedClients = testClients.filter(client => client.id !== idToRemove)
        return supertest(app)
          .delete(`/api/clients/${idToRemove}`)
          .expect(204)
          .then(res => 
            supertest(app)
              .get(`/api/clients`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(expectedClients)  
          )
      })
    })
  })

});

