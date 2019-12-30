const Provider = require('../../../models/provider')
const Slot = require('../../../models/slot').Slot;

class ProvidersController {
    static index(request, response) {
        Provider.connect().then(() => {
            const query = request.query.name ? request.query.name : '';
            Provider.findAll(query.toLowerCase())
                    .then((results) => response.send(results));
        })
    }
    static async show(request, response) {
        await Provider.connect();
        const providerDetails  = await Provider.find(request.params.providerId);
        var availableSlots = [];
        const appointmentDate = request.query.date;
        for (var i = 0; i < providerDetails.slots.length; i++) {
            const slot = providerDetails.slots[i];
            const isSlotAvailable = await Slot.isAvailable(slot, appointmentDate);
            if(isSlotAvailable) {
                availableSlots.push(slot);
            }
        }
        providerDetails.slots = availableSlots
            .sort((slot1, slot2) => slot1.startTime > slot2.startTime );
        response.send(providerDetails);
    }
}

module.exports = ProvidersController