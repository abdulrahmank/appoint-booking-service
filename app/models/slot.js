const BaseModel = require('./base_model')
const Provider = require('./provider')

class Slot extends BaseModel {

    constructor() {
        this.provider = new Provider()
    }

    async create(providerId, startTime, endTime) {
        await this.collection.update(
            { _id: new ObjectId(providerId) },
            {
                $push: {
                    slots: [
                        {
                            startTime: new Date(startTime),
                            endTime: new Date(endTime),
                            pendingRequests: [],
                            acceptedRequests: [],
                            declinedRequests:[]
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