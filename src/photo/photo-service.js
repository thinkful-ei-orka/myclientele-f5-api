const PhotoService = {
  getPhotosByReportId(knex, report_id) {
    return knex('photo')
      .select('photo.photo_url')
      .where('photo.report_id', report_id)
      .returning('*')
      .then(rows => {
        return rows.map(row => {
          return row.photo_url;
        });
      });
  },

  insertPhoto(knex, newPhoto) {
    return knex('photo')
      .insert(newPhoto)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  insertPhotos(db, newPhotos) {
    return db.transaction(async trx => {
      await trx.into('photo').insert(newPhotos);
    })
  }
};

module.exports = PhotoService;
