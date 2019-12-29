const { base64decode } = require('nodejs-base64');
const User = require('../models/user');

function initiateCookie(request, response, next) {
    const authorizationHeader = request.headers.authorization.substring('Basic '.length, request.headers.authorization.length)
    const authorization = base64decode(authorizationHeader);
    const userName = authorization.split(":")[0];
    User.connect().then(() => {
        User.findByName(userName).then((user) => {
            response.cookie('userId', user.id.toString());
            next();
        });
    });
}

module.exports = initiateCookie;