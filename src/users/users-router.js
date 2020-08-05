const express = require('express');
const path = require('path');
const { json } = require('express');
const UsersService = require('./users-service');
const CompaniesService = require('../companies/companies-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, async (req, res, next) => {
        const { name, userName, password, company, admin, email} = req.body

        for (const field of ['name', 'userName','password','company','admin', 'email'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        //insert comapny info to table with companyservice
            for (const field of ['company name', 'company location'])
            if (!req.body.company[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            const companyId = CompaniesService.insertCompany(company)

        //insert user into table with userService
        try {
            const passwordError = UsersService.validatePassword(password)

            if(passwordError) {
                return res.status(400).json({error: passwordError})
            }
            
            const duplicateUserError = await UsersService.ValidateUser(
                req.app.get('db'),
                userName)
            
            if (duplicateUserError) {
                return res.status(400).json({error: 'Username already exists'})
            }

            const hashedPassword = await UsersService.hashPassword(password)

            const userInfo = {
                name,
                user_name: userName,
                password: hashedPassword,
                company_id: companyId,
                admin,
                boss_id,
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