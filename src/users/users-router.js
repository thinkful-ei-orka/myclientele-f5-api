const express = require('express');
const path = require('path');
const { json } = require('express');
const UsersService = require('./users-service');
const CompaniesService = require('../companies/companies-service');
const AuthService = require('../auth/auth-service');

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, async (req, res, next) => {
        const { name, user_name, password, company_name, company_location, boss_id, admin, email} = req.body
        let bossId = boss_id;
        if(isNaN(Number(boss_id))) {
            bossId = null;
        }
        for (const field of ['name', 'user_name','password','company_name', 'company_location','admin', 'email'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        //insert comapny info to table with companyservice
            const company = {
                name: company_name,
                location: company_location
            }

            const companyId = await CompaniesService.insertCompany(req.app.get('db'),company)

        //insert user into table with userService
        try {
            const passwordError = UsersService.validatePassword(password)

            if(passwordError) {
                return res.status(400).json({error: passwordError})
            }
            
            // const duplicateUserError = await UsersService.validateUser(
            //     req.app.get('db'),
            //     user_name)
            // const duplicateUserError = await AuthService.getUserWithUserName(req.app.get('db'),user_name);
            const users = await UsersService.getUsers(req.app.get('db'));
            console.log('list of users',users);
            console.log('user_name', user_name);
            // console.log('error message', duplicateUserError)
            // if (duplicateUserError) {
            //     return res.status(400).json({error: 'Username already exists'})
            // }

            const hashedPassword = await UsersService.hashPassword(password)

            const userInfo = {
                name,
                user_name,
                password: hashedPassword,
                company_id: Number(companyId),
                admin,
                boss_id: bossId,
                email
            }
            
            await UsersService.insertUser(
                req.app.get('db'),
                userInfo)

        res
            .status(201)
            .send('User created')
            }
    
    catch(error) {
        next(error)
    }
    })

module.exports = usersRouter