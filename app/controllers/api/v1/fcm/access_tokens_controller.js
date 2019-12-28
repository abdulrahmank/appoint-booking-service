const User = require('../../../../models/user');

class AccessTokensController {
    static create(request, response) {
        User.connect().then(async () => {
            const user = await User.find(request.params.userId);
            user.updateFCMAccessToken(request.body.accessToken).then(() => {
                response.send('Access token updated successfully!')
            })
        })
    }
}

module.exports = AccessTokensController;