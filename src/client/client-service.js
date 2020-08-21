const xss = require('xss');

const ClientsService = {
    getClientsForUser(db, user_id) {
        return db
            .from('client')
            .select('*')
            .where('sales_rep_id', user_id);
    },
    getClientsByCompanyId(db, company_id) {
        return db
            .from('client')
            .select('*')
            .where('company_id', company_id);
    },

    serializeClient(client) {
        return {
            id: client.id,
            name: xss(client.name),
            location: xss(client.location),
            sales_rep_id: client.sales_rep_id,
            company_id: client.company_id,
            day_of_week: client.day_of_week,
            hours_of_operation: xss(client.hours_of_operation),
            currently_closed: client.currently_closed,
            notes: xss(client.notes),
            general_manager: xss(client.general_manager),
            photo: xss(client.photo),
            lat: client.lat,
            lng: client.lng,
        };
    },

    getClient(db, client_id) {
        return db
            .from('client')
            .select('*')
            .where('id', client_id)
            .first();
    },

    insertClient(db, newClient) {
        return db
            .insert(newClient)
            .into('client')
            .returning('*')
            .then(([client]) => client)
            .then(client =>
                ClientsService.getClient(db, client.id)
            );
    },

    updateClient(db, id, newClientFields) {
        return db('client')
            .where({ id })
            .update(newClientFields);
    },

    deleteClient(db, id) {
        return db('client')
            .where({ id })
            .delete();
    },
};


module.exports = ClientsService;
