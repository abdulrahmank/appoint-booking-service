const Provider = require('../../../models/provider')

class ProvidersController {
    static index(request, response) {
        Provider.connect().then(() => {
            Provider.findAll(request.query.name)
                    .then((results) => response.send(results));
        })
    }
    static show(request, response) {
        Provider.connect().then(() => {
            Provider.find(request.params.providerId)
                    .then((results) => response.send(results));
        })
    }
}

module.exports = ProvidersController