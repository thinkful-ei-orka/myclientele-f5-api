const express = require('express');
const CompaniesService = require('./companies-service');

const CompanyRouter = express.Router();

CompanyRouter.route('/:company_id')
    .all((req, res, next) => {
    //incase more routes are implemented later
        CompaniesService.getCompany(req.app.get('db'), req.params.company_id)
            .then((company) => {
                if (!company) {
                    return res.status(404).json({
                        error: { message: 'Company doesn\'t exist' },
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

CompanyRouter
    .route('/')
    .get(async (req, res, next) => {
      let code = req.query.code;
      //Used for signing up under an existing company.  The user must have a link with the appropriate company code in order to make an account with each company.
      if(code === 'null') {
        return res.status(400).json({
          error: 'Please contact your administrator for an invitation link!'
        });
      } else {
      //Check if you can find the company by company code, if not, return 404  
        let company = await CompaniesService.getCompanyByCode(req.app.get('db'), code);
        if (!company) {
          return res.status(404).json({
            error: 'It appears that your invitation link is invalid. Please try again'
          });
        }
        res.json(CompaniesService.serializeCompany(company));
      }
    });

module.exports = CompanyRouter;
