const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },

  getUsers(db) {
    return db('myclientele_user').select('*');
  },

  validateUser(db, user_name) {
    return db('myclientele_user')
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },

  getUserWithEmail(db, email) {
    return db('myclientele_user').where({ email }).first();
  },
  
  getUserWithPhoneNum(db, phone_number) {
    return db('myclientele_user').where({ phone_number }).first();
  },

  getUserContactInfo(db, userId) {
    return db('myclientele_user')
      .select(
        'id',
        'name',
        'user_name',
        'phone_number',
        'email',
        'admin',
        'company_id'
      )
      .where('id', userId)
      .first();
  },

  getUserByCompanyId(db, company_id) {
    return db('myclientele_user')
      .select('id', 'name', 'user_name', 'company_id', 'admin', 'email', 'phone_number')
      .where('company_id', company_id);
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  insertUser(db, userInfo) {
    return db
      .insert(userInfo) // might need to make the boss id null in the table as a default
      .into('myclientele_user');
  },

  updateUser(db, userId, updatedUserInfo) {
    return db('myclientele_user').update(updatedUserInfo).where('id', userId);
  },
};

module.exports = UsersService;
