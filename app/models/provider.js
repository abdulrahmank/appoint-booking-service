const BaseModel = require('./base_model');
const mongo = require('mongodb');

class Provider {
    
    constructor(providerJson) {
        if (providerJson) {
            this._setFields(providerJson);
        }
    }

    static async connect() {
        this.collection = await BaseModel.connect('providers');
    }

    static async findAll(providerName) {
        const projections = { projection: { name: 1, services: 1, location: 1 } };
        const query = providerName ? {"name" : new RegExp('.*' + providerName + '.*')} : {};
        const providersJson = await this.collection.find(query, projections).toArray();
        const providers = providersJson.map((providerJson) => {
                            return new Provider(providerJson);
                        });
        return providers;
    }

    static async find(providerId) {
        const provider = await this.collection.find({ "_id": new mongo.ObjectID(providerId) }).toArray();
        return new Provider(provider[0]);
    }

    _setFields(providerJson) {
        this.id = providerJson._id;
        this.name = providerJson.name;
        this.location = providerJson.location;
        this.services = providerJson.services;
        this.slots = providerJson.slots;
    }
}

module.exports = Provider