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
    static show(request, response) {
        Provider.connect().then(() => {
            Provider.find(request.params.providerId).then((providerDetails) => {
                providerDetails.slots = 
                    providerDetails.slots
                        .filter((slot) => Slot.isNotBooked(slot))
                        .sort((slot1, slot2) => slot1.startTime > slot2.startTime );
                response.send(providerDetails);
            });
        })
    }
}

module.exports = ProvidersController