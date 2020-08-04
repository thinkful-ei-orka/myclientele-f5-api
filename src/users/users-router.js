const express = require('express');
const path = require('path');
const { json } = require('express');
const UsersService = require('./users-service');
const CompaniesService = require('../companies/companies-service')

const userRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, async (req, res, next) => {
        const { name, userName, password, company, admin, boss_id} = req.body

        for (const field of ['name', 'userName','password','company','admin','bossId'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        //insert comapny info to table with companyservice
        try {
            const companyId = CompaniesService.runOk()
        }
        //insert user into table with userService
    })

module.exports = usersRouter