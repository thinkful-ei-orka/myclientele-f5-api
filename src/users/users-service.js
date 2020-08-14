const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const REGEX_NUMBER = /(?=.*[0-9])/;

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
    return db('users')
      .select('*');
  },
  validateUser(db, user_name) {
    return db('users')
      .where({user_name})
      .first()
      .then(user => !!user);
  },
  getUserWithEmail(db, email) {
    return db('users')
      .where({email})
      .first();
  },
  getUserWithPhoneNum(db, phone_number) {
    return db('users')
      .where({phone_number})
      .first();
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  insertUser(db, userInfo) {
    return db
      .insert(userInfo) // might need to make the boss id null in the table as a default
      .into('users');
  },
  // validatePhoneNumeber(db, phone_number) {
  //   if (phone_number.length !== 10) {
  //     return 'Must be a valid phone number'
  //   }
  //   if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(phone_number)) {
  //     return 'Must be a valid phone number'
  // }
};

module.exports = UsersService;