const Slot = require('../../../models/slot');

class SlotsController {
    static create(request, response) {
        const slot = new Slot();
        slot.connect().then(() => {
            slot.create(
                request.params.providerId,
                request.body.startTime,
                request.body.endTime).then(() => {
                    response.send('Slot created successfully!');
                });
        });
    }
}

module.exports = SlotsController;