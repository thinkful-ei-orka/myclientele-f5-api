const express = require("express");
const path = require("path");
const { json } = require("express");
const UsersService = require("./users-service");
const CompaniesService = require("../companies/companies-service");
const AuthService = require("../auth/auth-service");
const cuid = require("cuid");
const { requireAuth } = require("../middleware/jwt-auth");


const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.post("/", jsonBodyParser, async (req, res, next) => {
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

  try {
    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const duplicateUserError = await UsersService.validateUser(
      req.app.get("db"),
      user_name
    );
    // const duplicateUserError = await AuthService.getUserWithUserName(req.app.get('db'),user_name);
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
    if (company.company_code) {
      userInfo.company_id = company.id;
    } else {
      company.company_code = cuid();
      const newCompany = await CompaniesService.insertCompany(
        req.app.get("db"),
        company
      );
      userInfo.company_id = newCompany.id;
    }
    await UsersService.insertUser(req.app.get("db"), userInfo);
    res.status(201).json({ message: "User created" });
  } catch (error) {
    next(error);
  }
});

usersRouter
    .all(requireAuth)
    .route('/:id')
    .get(async (req, res, next) => {
        console.log('running! line 111')
        res.json(req.user)
    })

module.exports = usersRouter;
