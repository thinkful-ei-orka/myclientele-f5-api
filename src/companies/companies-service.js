const xss = require('xss');

const CompaniesService = {
  getCompany(db, company_id) {
    return db.from('company').select('*').where('id', company_id).first();
  },
  
  getCompanyByCode(db, code) {
    return db.from('company').select('*').where('company_code', code).first();
  },

  insertCompany(db, newCompany) {
    return db('company')
      .insert(newCompany)
      .into('company')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  serializeCompany(company) {
    return {
      id: company.id,
      name: xss(company.name),
      location: xss(company.location),
      company_code: company.company_code,
    };
  },
};

module.exports = CompaniesService;
