const express = require('express');
const path = require('path');
const { json } = require('express');
const UsersService = require('./users-service');
const CompaniesService = require('../companies/companies-service');
const AuthService = require('../auth/auth-service');
const { requireAuth } = require('../middleware/jwt-auth');

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter.route('/')
    .post(jsonBodyParser, async (req, res, next) => {
        const { name, user_name, password, company_name, company_location, admin, boss_id, email, phone_number} = req.body
        let phone_num = phone_number;
        let bossId = boss_id;
        if(isNaN(Number(boss_id))) {
            bossId = null;
        }
        if(!phone_number) {
            phone_num = null;
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

            const newCompany = await CompaniesService.insertCompany(req.app.get('db'),company);

        //insert user into table with userService
        try {
            const passwordError = UsersService.validatePassword(password)

            if(passwordError) {
                return res.status(400).json({error: passwordError})
            }

            const duplicateUserError = await UsersService.validateUser(
                req.app.get('db'),
                user_name)
            // const duplicateUserError = await AuthService.getUserWithUserName(req.app.get('db'),user_name);
            const users = await UsersService.getUsers(req.app.get('db'));
            if (duplicateUserError) {
                return res.status(400).json({error: 'Username already exists'})
            }
            const emailInDatabase = await UsersService.getUserWithEmail(req.app.get('db'), email);
            if(emailInDatabase) {
                return res.status(400).json({error: `User with that email already exists`})
            }
            if(phone_num !== null) {
                const phoneNumInDatabase = await UsersService.getUserWithPhoneNum(req.app.get('db'),phone_number);
                if(phoneNumInDatabase) {
                    res.status(400).json({error: `User with that phone number already exists`})
                }
            }

            const hashedPassword = await UsersService.hashPassword(password)

            const userInfo = {
                name,
                user_name,
                password: hashedPassword,
                company_id: Number(newCompany.id),
                admin,
                phone_number: phone_num,
                boss_id: bossId,
                email
            }

            await UsersService.insertUser(
                req.app.get('db'),
                userInfo)
                
                res
                .status(201)
            .json({message: 'User created'})
        }
        
        catch(error) {
            next(error)
        }
    })
    .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
        const {name, username, passwords, email, phone_number} = req.body
        let updatedUserAccount = {}
        let newHashedPassword
        console.log(req.body);

        if (name) {
            updatedUserAccount.name = name
        }
        if (req.body.passwords !== '') {
            const passwordError = UsersService.validatePassword(passwords);

        if(passwordError) {
            return res.status(400).json({error: passwordError})
        }
                        
            newHashedPassword = await UsersService.hashPassword(passwords)
            updatedUserAccount.password = newHashedPassword
        }
                    
        if (username) {
            const duplicateUserError = await UsersService.validateUser(
            req.app.get('db'),
            username)
                    
            if (duplicateUserError) {
                return res.status(400).json({error: 'Username already exists'})
            }
            updatedUserAccount.user_name = username
        }
                        
            if(email) {
                const emailInDatabase = await UsersService.getUserWithEmail(req.app.get('db'), email);
                if(emailInDatabase) {
                    return res.status(400).json({error: `User with that email already exists`})
                }
                updatedUserAccount.email = email
            }
                        
            if(phone_number) {
                const phoneNumInDatabase = await UsersService.getUserWithPhoneNum(req.app.get('db'),phone_number);
                if(phoneNumInDatabase) {
                    res.status(400).json({error: `User with that phone number already exists`})
                }
                updatedUserAccount.phone_number = phone_number
            }
            console.log(updatedUserAccount)
            if(JSON.stringify(updatedUserAccount) !== '{}') {            
                return UsersService.updateUser(req.app.get('db'), req.user.id, updatedUserAccount)
                    .then(data => {
                        res.status(204).end();
                    })
                    .catch(next)
            }
    })

usersRouter.route('/contact')
    .get(requireAuth, async (req, res, next) => {
        UsersService.getUserContactInfo(req.app.get('db'),req.user.id)
        .then((info) => {
            console.log('hi',info);
            res.json(info)
        })
        .catch(next);
    });
    

module.exports = usersRouter
