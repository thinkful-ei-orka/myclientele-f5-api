const xss = require('xss')

const ClientsService = {
  getClientsForUser(db, user_id) {
    return db
      .from('client')
      .select('*')
      .where('sales_rep_id', user_id)
  },

  serializeClient(client) {
    return {
      id: client.id,
      name: xss(client.name),
      location: xss(client.location),
      sales_rep_id: client.sales_rep_id,
      company_id: client.company_id,
      day_of_week: xss(client.day_of_week),
      hours_of_operation: xss(client.hours_of_operation),
      currently_closed: client.currently_closed,
      notes: xss(client.notes),
      general_manager: xss(client.general_manager)
    }
  }

}


module.exports = ClientsService