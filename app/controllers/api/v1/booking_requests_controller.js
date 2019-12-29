const BookingRequest = require('../../../models/booking_request');
const Slot = require('../../../models/slot').Slot;
const User = require('../../../models/user');
const NotificationService = require('../../../service/notification_service');

class BookingRequesController {
    static create(request, response) {
        debugger;
        Promise.all([BookingRequest.connect(), Slot.connect()]).then(() => {
            debugger;
            BookingRequest.create(request.body).then((bookingRequest) => {
                Slot.addBookingRequest(bookingRequest.providerId,
                    bookingRequest.slotId, bookingRequest.id).then(async () => {
                    new NotificationService().notifyServiceProviders(bookingRequest).then(() => {
                        response.send('Notified service providers successfully!');
                    });
                });
                
            });
        });
    }

    static update(request, response) {
        BookingRequest.connect().then(async () => {
            const bookingRequest = await BookingRequest.find(request.params.bookingRequestId);
            const updatedStatus = request.body.status;
            switch(updatedStatus) {
                case 'accepted':
                case 'rejected':
                    Slot.updateBookingRequest(bookingRequest.providerId,
                        bookingRequest.slotId, bookingRequest.id, updatedStatus).then(() => {
                       new NotificationService().notifyServiceProviders(bookingRequest);
                       new NotificationService().notifyUser(bookingRequest.userId, updatedStatus);   
                    });
                    break;                                                                                                              
                default:
                    console.log('Unknown status!');
            }
            response.send('Notified users successfully!');
        });
    }

    static async show(request, response) {
        await BookingRequest.connect();
        await User.connect();
        await Provider.connect();
        
        const bookingRequest = BookingRequest.find(request.params.bookingRequestId);
        const user = User.find(bookingRequest.userId);
        const slot = Slot.find(bookingRequest.providerId, bookingRequest.slotId);

        response.render('../views/booking_requests/show', {
            bookingRequest,
            user,
            slot
        });
    }
}

module.exports = BookingRequesController;