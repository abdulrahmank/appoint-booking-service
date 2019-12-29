const BookingRequest = require('../models/booking_request');
const Slot = require('../models/slot').Slot;
const User = require('../models/user');
const Provider = require('../models/provider');

class BookingRequestsController {
    static async show(request, response) {
        Promise.all([
            BookingRequest.connect(),
            User.connect(),
            Provider.connect(),
            Slot.connect()
        ]).then(async () => {
            const bookingRequest = await BookingRequest.find(request.params.bookingRequestId);
            const user = await User.find(bookingRequest.userId);
            const slot = await Slot.find(bookingRequest.providerId, bookingRequest.slotId);
        
            response.render('../views/booking_requests/show', {
                bookingRequest,
                user,
                slot
            });
        });
    }
}

module.exports = BookingRequestsController;