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
      console.log('code!', code);
      if(code === 'null') {
        return res.status(400).json({
          error: 'Please contact your administrator for an invitation link!'
        })
      } else {
        console.log('We have a code');
        let company = await CompaniesService.getCompanyByCode(req.app.get('db'), code);
        if(!company) {
          return res.status(404).json({
            error: 'It appears that your invitation link is invalid. Please try again'
          })
        }
        res.json(CompaniesService.serializeCompany(company))
      }
    });

module.exports = CompanyRouter;
