const CompaniesService = {
    insertCompany(db, company) {
        return db('company')
            .insert({name: company.name, location: company.location})
            .returning('id')
    }
}

module.exports = CompaniesService