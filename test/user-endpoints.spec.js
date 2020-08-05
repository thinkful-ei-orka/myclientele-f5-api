const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Users Endpoints', () => {
    let db;
    const testUsers = helpers.makeTestUsers();
    const testCompanies = helpers.makeCompanyArray();
    const testUser = testUsers[0];
    const testCompany = testCompanies[0];
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());
    before('clean table', () =>
        db.raw('TRUNCATE company, users, client, report RESTART IDENTITY CASCADE')
    );
    afterEach('clean table', () =>
    db.raw('TRUNCATE company, users, client, report RESTART IDENTITY CASCADE')
    );

    describe('POST /api/users', () => {
        const reqBody = {
            name: testUser.name,
            userName: testUser.user_name,
            password: 'password1234@#',
            company:{
                name: testCompany.name,
                location: testCompany.location
            },
            admin: testUser.admin,
            email: testUser.email,
        }

        //returns 400 when missing part of the user
        it('400 resposne if user info is missing', () => {
            let userInfoMissReqBody = {
                name: testUser.name,
                password: 'password1234@#',
                company:{
                    name: testCompany.name,
                    location: testCompany.location
                },
                admin: testUser.admin,
                email: testUser.email,
            }

            return supertest(app)
                .post('/api/users')
                .send(userInfoMissReqBody)
                .expect(400)
        })
        //returns 400 when missing part of the company
        it('400 response if company info is missing', () => {
            const companyInfoMissReqBody = {
                name: testUser.name,
                userName: testUser.user_name,
                password: 'password1234@#',
                company:{
                    name: testCompany.name,
                },
                admin: testUser.admin,
                email: testUser.email,
            }

            return supertest(app)
                .post('/api/users')
                .send(companyInfoMissReqBody)
                .expect(400)
        })
        // returns 400 if password isnt' valid
        it('400 response if password is invalid', () => {
            const invalidPasswordReqBody = {
                name: testUser.name,
                userName: testUser.user_name,
                password: testUser.password,
                company:{
                    name: testCompany.name,
                },
                admin: testUser.admin,
                email: testUser.email,
            }
        console.log(reqBody)

            return supertest(app)
                .post('/api/users')
                .send(invalidPasswordReqBody)
                .expect(400)
        })

        returns 400 if username exists
        it('400 response if username exists', () => {
            before('seed databse with info', () =>
                helpers.seedUsers(db, testUsers))

            return supertest(app)
                .post('/api/users')
                .send(reqBody)
                .expect(400, {error:'Username already exists'})
        })


        // returns 200 if is user is and company are inserted
        it('201 response when company info, user info, and valid password is sent', () => {

            return supertest(app)
                .post('/api/users')
                .send(reqBody)
                .expect(201)
        })


    })
})