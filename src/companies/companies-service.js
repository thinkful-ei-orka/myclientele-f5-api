const xss = require('xss');

const CompaniesService = {
  getCompany(db, company_id) {
    return db
      .from('company')
      .select('*')
      .where('id', company_id)
      .first();
  },

  insertCompany(db, newCompany) {
    return db('company')
      .insert(newCompany)
      .into('company')
      .returning('*')
      .then(([company]) => company)
      .then(company => 
        CompaniesService.getCompany(db, company.id)    
      );
  },

  serializeCompany(company) {
    return {
      id: company.id,
      name: xss(company.name),
      location: xss(company.location)
    };
  }
};
 
module.exports = CompaniesService;