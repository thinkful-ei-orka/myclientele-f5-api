const express = require('express');
const CompaniesService = require('./companies-service');

const CompanyRouter = express.Router();

CompanyRouter
  .route('/:company_id')
  .all((req, res, next) => { //incase more routes are implemented later
    CompaniesService.getCompany(
      req.app.get('db'),
      req.params.company_id
    )
      .then(company => {
        if(!company) {
          return res.status(404).json({
            error: { message: `Company doesn't exist`}
          });
        }
        res.company = company;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(CompaniesService.serializeCompany(res.company));
  });

module.exports = CompanyRouter;