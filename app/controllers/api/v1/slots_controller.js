const Slot = require('../../../models/slot').Slot;

class SlotsController {
    static create(request, response) {
        Slot.connect().then(() => {
            Slot.create(
                request.params.providerId,
                request.body.startTime,
                request.body.endTime).then(() => {
                    response.send('Slot created successfully!');
                });
        });
    }
}

module.exports = SlotsController;