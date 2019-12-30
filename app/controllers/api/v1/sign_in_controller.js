const User = require('../../../models/user');
const bcrypt = require('bcrypt');

class SignInController {
    static async signIn(request, response) {
        const username = request.body.username;
        await User.connect();
        const user = await User.findByName(username);
        const password = request.body.password;
        bcrypt.compare(password, user.passwordDigest, (err, success) => {
            if (success) {
                response.send({userId: user.id});
            } else {
                response.sendStatus(401);
            }
        });
    }
}

module.exports = SignInController;