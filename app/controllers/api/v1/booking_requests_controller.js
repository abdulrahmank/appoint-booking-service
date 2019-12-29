const BookingRequest = require('../../../models/booking_request');
const Slot = require('../../../models/slot').Slot;
const NotificationService = require('../../../service/notification_service');

class BookingRequestsController {
    static create(request, response) {
        Promise.all([BookingRequest.connect(), Slot.connect()]).then(() => {
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
}

module.exports = BookingRequestsController;