const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

authRouter.put('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name;
  const payload = { user_id: req.user.id, company_id: req.user.company_id  };

  res.send({
    authToken: AuthService.createJwt(sub, payload),
  });
});

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null ) {
      return res.status(400).json({
        error: `Missing ${key} in request body`,
      });
    }
  }
  //fetch user with particular username to see if user exists, then compare passwords
  AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({
          error: 'Incorrect user_name or password',
        });
      }

      if (dbUser.user_disabled) {
        return res.status(400).json({
          error: 'Your account has been disabled by your company administrator. Please contact them if you would like to log back in.',
        });
      }

      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch) {
          return res.status(400).json({
            error: 'Incorrect user_name or password',
          });
        }
        //create sub and payload to create a JWT for the user
        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id, company_id: dbUser.company_id };

        return res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

module.exports = authRouter;
