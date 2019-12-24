const BaseModel = require('./base_model');
const mongo = require('mongodb');

class Provider extends BaseModel {
    
    async findAll(providerName) {
        const projections = { projection: { name: 1, services: 1, location: 1 } };
        const query = providerName ? {"name" : new RegExp('.*' + providerName + '.*')} : {};
        const providers = await this.collection.find(query, projections).toArray();
        return providers;
    }

    async find(providerId) {
        const provider = await this.collection.find({ "_id": new mongo.ObjectID(providerId) }).toArray()
        return provider;
    }

    getCollectionName() {
        return 'providers'
    }
}

module.exports = Provider