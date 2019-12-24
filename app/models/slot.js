const BaseModel = require('./base_model')
const mongo = require('mongodb');

class Slot {
    constructor(providerId, slotJson) {
        this.providerId = providerId;
        this._id = slotJson._id;
        this.startTime = slotJson.startTime;
        this.endTime = slotJson.endTime;
        this.appointments = slotJson.appointments;
    }

    static async connect() {
        return BaseModel.connect()
    }

    static async create(providerId, startTime, endTime) {
        await this.collection.update(
            { _id: new mongo.ObjectID(providerId) },
            {
                $push: {
                    slots: [
                        new Slot(providerId, {
                            startTime, 
                            endTime,
                            appointments: {
                                accepted: [],
                                pending: [],
                                declined: []
                            }
                        })
                    ]
                }
            }
        )
    }

    toJSON() {
        return {
            _id: this._id,
            startTime: this.startTime,
            endTime: this.endTime,
            appointments: this.appointments,
            status: this.getStatus()
        }
    }

    getStatus() {
        if (this.appointments.accepted.length > 0) {
            return statuses.BOOKED;
        } else if (this.providerId) {
            return statuses.AVAILABLE;
        } else {
            return statuses.UN_AVAILABLE;
        }
    }
}

const statuses = {
    AVAILABLE: 'available',
    UN_AVAILABLE: 'un_available',
    BOOKED: 'booked',
}

module.exports = { Slot, statuses};