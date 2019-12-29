const User = require('../models/user');
var FCM = require('fcm-node');

class NotificationService {
    constructor() {
        this.fcm = new FCM(process.env.FCM_SERVER_KEY);
    }

    async notifyServiceProviders(bookingRequest) {
        await User.connect();
        User.findByProviderId(bookingRequest.providerId).then((users) => {
            users.forEach(user => {
                this._notify(user, 'A user is requesting for an appointment.', {
                    bookingRequestId: bookingRequest.id
                })
            });
        });
    }

    notifyUser(user, status) {
        this._notify(user, `Your request for appointment was ${status} by service provider.`);
    }

    _notify(user, body, data) {
        var message = {
            to: user.fcmAccessToken, 
            notification: {
                title: 'Request for appointment', 
                body,
            },
            data
        };
        
        this.fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        })
    }
}

module.exports = NotificationService;