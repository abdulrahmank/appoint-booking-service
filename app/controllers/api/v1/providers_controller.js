const Provider = require('../../../models/provider')

class ProvidersController {
    static index(request, response) {
        const provider = new Provider();
        provider.connect().then(() => {
            provider.findAll(request.query.name)
                    .then((result) => response.send(result));
        })
    }
    static show(request, response) {
        const provider = new Provider();
        provider.connect().then(() => {
            provider.find(request.params.provider_id)
                    .then((results) => response.send(results));
        })
    }
}

module.exports = ProvidersController