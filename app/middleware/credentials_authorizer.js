const User = require('../models/user');
const bcrypt = require('bcrypt');
const basicAuth = require('express-basic-auth')

async function authenticate(username, password, callback) {
    if (basicAuth.safeCompare(username, 'abdullah') && basicAuth.safeCompare(password, 'password1')) {
        return callback(null, true);
    }
    return callback(null, false);
}

module.exports = authenticate;