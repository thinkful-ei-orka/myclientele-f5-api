const express = require("express");
const path = require("path");
const { json } = require("express");
const UsersService = require("./users-service");
const CompaniesService = require("../companies/companies-service");
const AuthService = require("../auth/auth-service");
const { requireAuth } = require("../middleware/jwt-auth");
const cuid = require("cuid");
const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route("/")
  .post(jsonBodyParser, async (req, res, next) => {
    const {
      name,
      user_name,
      password,
      company,
      admin,
      boss_id,
      email,
      phone_number,
    } = req.body;

    let phone_num = phone_number;
    let bossId = boss_id;

    if (isNaN(Number(boss_id))) {
      bossId = null;
    }
    if (!phone_number) {
      phone_num = null;
    }
    for (const field of ["name", "user_name", "password", "email"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        });
    for (const field of ['name', 'location']) 
        if (!company[field]) 
            return res.status(400).json({
                error: `Missing ${field} in company info`
            });     

    try {
      const passwordError = UsersService.validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ error: passwordError });
      }
      const duplicateUserError = await UsersService.validateUser(
        req.app.get("db"),
        user_name
      );
      const users = await UsersService.getUsers(req.app.get("db"));
      if (duplicateUserError) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const emailInDatabase = await UsersService.getUserWithEmail(
        req.app.get("db"),
        email
      );
      if (emailInDatabase) {
        return res
          .status(400)
          .json({ error: `User with that email already exists` });
      }
      if (phone_num !== null) {
        const phoneNumInDatabase = await UsersService.getUserWithPhoneNum(
          req.app.get("db"),
          phone_number
        );
        if (phoneNumInDatabase) {
          return res
            .status(400)
            .json({ error: `User with that phone number already exists` });
        }
      }
      const hashedPassword = await UsersService.hashPassword(password);
      const userInfo = {
        name,
        user_name,
        password: hashedPassword,
        admin,
        phone_number: phone_num,
        boss_id: bossId,
        email,
      };
      //insert comapny info to table with companyservice
      if (!company.company_code) {
        //If the user does not have a company code, then generate a unique company code for each company
        company.company_code = cuid();
        let companyInfo = {
            name: company.name,
            location: company.location,
            company_code: company.company_code
        }
        const newCompany = await CompaniesService.insertCompany(
          req.app.get("db"),
          companyInfo
        );
        userInfo.company_id = newCompany.id;
      } else {
        //The user is signing up under an existing company, so we do not need to create a new company, we just need to assign the company id to the new user
        userInfo.company_id = company.id;
      }
      await UsersService.insertUser(req.app.get("db"), userInfo);
      res.status(201).json({ message: "User created" });
    } catch (error) {
      next(error);
    }
  })
  .patch(requireAuth, jsonBodyParser, async (req, res, next) => {
    const { name, username, passwords, email, phone_number } = req.body;
    let updatedUserAccount = {};
    let newHashedPassword;

    if (name) {
      updatedUserAccount.name = name;
    }
    if (req.body.passwords !== "") {
      const passwordError = UsersService.validatePassword(passwords);

      if (passwordError) {
        return res.status(400).json({ error: passwordError });
      }

      newHashedPassword = await UsersService.hashPassword(passwords);
      updatedUserAccount.password = newHashedPassword;
    }

    if (username) {
      const duplicateUserError = await UsersService.validateUser(
        req.app.get("db"),
        username
      );

      if (duplicateUserError) {
        return res.status(400).json({ error: "Username already exists" });
      }
      updatedUserAccount.user_name = username;
    }

    if (email) {
      const emailInDatabase = await UsersService.getUserWithEmail(
        req.app.get("db"),
        email
      );
      if (emailInDatabase) {
        return res
          .status(400)
          .json({ error: `User with that email already exists` });
      }
      updatedUserAccount.email = email;
    }

    if (phone_number) {
      const phoneNumInDatabase = await UsersService.getUserWithPhoneNum(
        req.app.get("db"),
        phone_number
      );
      if (phoneNumInDatabase) {
        res
          .status(400)
          .json({ error: `User with that phone number already exists` });
      }
      updatedUserAccount.phone_number = phone_number;
    }
    if (JSON.stringify(updatedUserAccount) !== "{}") {
      return UsersService.updateUser(
        req.app.get("db"),
        req.user.id,
        updatedUserAccount
      )
        .then((data) => {
          res.status(204).end();
        })
        .catch(next);
    }
  });

usersRouter.route("/contact").get(requireAuth, async (req, res, next) => {
  UsersService.getUserContactInfo(req.app.get("db"), req.user.id)
    .then((info) => {
      res.json(info);
    })
    .catch(next);
});

usersRouter.route("/employees").get(requireAuth, async (req, res, next) => {
    //This route is used for admins to get a list of their employees
    if (req.user.admin) {
    UsersService.getUserByCompanyId(req.app.get("db"), req.user.company_id)
      .then((users) => {
        res.json(users);
      })
      .catch(next);
  } else {
      return res.status(401).json({error: 'Unauthorized request'});
  }
});

module.exports = usersRouter;
