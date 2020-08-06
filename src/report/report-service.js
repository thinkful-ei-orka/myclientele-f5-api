const xss = require('xss');

const ReportService = {
    getAllReports(knex, user) {
        return knex
            .from('report')
            .select('report.*', 'users.user_name')
            .join('users', 'report.sales_rep_id', '=', 'users.id')
            .where('users.user_name', user);
    },
    getById(knex, id) {
        return knex
            .from('report')
            .select('*')
            .where('id', id)
            .first();
    },
    serializeReports(reports) {
        return reports.map(this.serializeReport);
    },
    serializeReport(report) {
        return {
            id: report.id,
            client_id: report.client_id,
            sales_rep_id: report.sales_rep_id,
            date: xss(report.date),
            notes: xss(report.notes),
            photo_url: xss(report.photo_url)
        };
    }
};

module.exports = ReportService;
