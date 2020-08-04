const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
          return 'Password be longer than 8 characters'
        }
        if (password.length > 72) {
          return 'Password be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
          return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
          return 'Password must contain one upper case, lower case, number and special character'
        }
        return null
      },
    
    validateUser(db, userName) {
        return db('users')
            .where({userName})
            .first()
            .then(user => !!user)
    },

    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    insertUser(db, userInfo) {
        return db
            .insert(userInfo)
            .into('users')
    }
}

module.exports = UsersService