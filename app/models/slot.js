const BaseModel = require('./base_model')
const Provider = require('./provider')
const mongo = require('mongodb');

class Slot extends BaseModel {

    constructor() {
        this.provider = new Provider()
    }

    async create(providerId, startTime, endTime) {
        await this.collection.update(
            { _id: new mongo.ObjectID(providerId) },
            {
                $push: {
                    slots: [
                        {
                            _id: new mongo.ObjectID(),
                            startTime: new Date(startTime),
                            endTime: new Date(endTime),
                            requests: {
                                accepted: [],
                                pending: [],
                                declined: []
                            }
                        }
                    ]
                }
            }
        )
    }

    getCollectionName() {
        return this.provider.getCollectionName();
    }

}

module.exports = Slot;