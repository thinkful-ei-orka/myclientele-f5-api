const xss = require('xss');

const ReportService = {
  getAllReports(knex, user_id) {
    return knex
      .from('report')
      .select('*')
      .where('report.sales_rep_id', user_id);
  },
  //TODO: Cant get this to return the corrent reports
  getReportsByClientId(knex, client_id) {
    return (
      knex
        .from('report')
        .select('*')
        // .join('users', 'report.sales_rep_id', '=', 'users.id')
        // .join('client', 'report.client_id', '=', 'client.id')
        .where('report.client_id', client_id)
        .returning('*')
        .then((res) => {
          return res.filter((report) => report.client_id !== client_id);
        })
    );
  },
  getById(knex, id) {
    return knex
      .from('report', 'users.user_name', 'client.name', 'client.location')
      .select('*')
      .where('report.id', id)
      .join('users', 'report.sales_rep_id', '=', 'users.id')
      .join('client', 'report.client_id', '=', 'client.id')
      .first();
  },

  // , 'users.name as sales_rep_name'
  insertReport(knex, newReport) {
    return knex
      .into('report')
      .insert(newReport)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  updateReport(knex, id, newData) {
    return knex('report').where({ id }).update(newData);
  },
  deleteReport(knex, id) {
    return knex('report').where({ id }).delete();
  },
  serializeReports(reports) {
    return reports.map(this.serializeReport);
  },
  serializeReport(report) {
    return {
      id: report.id,
      client_id: report.client_id,
      sales_rep_id: report.sales_rep_id,
      sales_rep_name: report.sales_rep_name,
      date: report.date,
      notes: xss(report.notes),
      photo_url: xss(report.photo_url),
      location: report.location,
    };
  },
  getLatestReportDate(knex,clientId) {
    return knex
        .from('report')
        .select('date')
        .where('client_id', clientId)
        .orderBy('date', 'desc')
        .first()
}
};

module.exports = ReportService;
