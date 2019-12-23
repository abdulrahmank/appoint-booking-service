const BaseModel = require('./base_model')

class Provider extends BaseModel {
    
    async findAll(providerName) {
        const query = providerName ? {"name" : /.*providerName.*/} : {};
        const providers = await this.collection.find(query).toArray();
        return providers;
    }

    async find(providerId) {
        const provider = await this.collection.find({ "_id": providerId }).toArray()
        return provider;
    }

    getCollectionName() {
        return 'providers'
    }
}

module.exports = Provider