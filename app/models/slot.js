const BaseModel = require('./base_model')
const BookingRequest = require('./booking_request');
const mongo = require('mongodb');

class Slot {
    constructor(providerId, slotJson) {
        this.providerId = providerId;
        this._id = slotJson._id;
        this.startTime = slotJson.startTime;
        this.endTime = slotJson.endTime;
        this.accepted_booking_requests = slotJson.accepted_booking_requests;
        this.pending_booking_requests = slotJson.pending_booking_requests;
        this.rejected_booking_requests = slotJson.rejected_booking_requests;
        this.status = this.getStatus();
    }

    static async connect() {
        this.collection = await BaseModel.connect('providers');
    }

    static async create(providerId, startTime, endTime) {
        await this.collection.update(
            { _id: new mongo.ObjectID(providerId) },
            {
                $push: {
                    slots:
                        new Slot(new mongo.ObjectID(providerId), {
                            _id: new mongo.ObjectID(),
                            startTime: startTime,
                            endTime: endTime,
                            accepted_booking_requests: [],
                            pending_booking_requests: [],
                            rejected_booking_requests: []
                        }).toJSON()
                }
            }
        )
    }

    static async find(providerId, slotId) {
        const provider = await this.collection.aggregate([
            {
                $match: { _id: new mongo.ObjectID(providerId) }
            }
            ,{
                $project: { slots: { $filter: {
                input: "$slots",
                as:"slot",
                cond: { $eq : ["$$slot._id", new mongo.ObjectID(slotId)] }
            } } }
        }]).toArray();
        return new Slot(providerId, provider[0].slots[0]);
    }

    static async addBookingRequest(providerId, slotId, bookingRequestId) {
        await this.collection.updateOne({ 
            "_id": new mongo.ObjectID(providerId), 
            "slots._id": new mongo.ObjectID(slotId)
        }, { 
            $push : {
                'slots.$.pending_booking_requests': bookingRequestId
            }
        });
    }

    static async updateBookingRequest(providerId, slotId, bookingRequestId, status) {
        var desiredRequestState = {};
        desiredRequestState[`slots.$.${status}_booking_requests`] = new mongo.ObjectID(bookingRequestId.id);
        await Promise.all([
            this.collection.updateOne({
                "_id": new mongo.ObjectID(providerId),
                "slots._id": new mongo.ObjectID(slotId)
            }, {
                $pull : {
                    'slots.$.pending_booking_requests': new mongo.ObjectID(bookingRequestId.id)
                }
            }),
            this.collection.updateOne({
                "_id": new mongo.ObjectID(providerId),
                "slots._id": new mongo.ObjectID(slotId)
            }, {
                $push : desiredRequestState,
            })
        ]);
    }

    static isNotBooked(slot) {
        return slot.accepted_booking_requests.length == 0;
    }

    toJSON() {
        return {
            _id: this._id,
            startTime: this.startTime,
            endTime: this.endTime,
            accepted_booking_requests: this.accepted_booking_requests,
            pending_booking_requests: this.pending_booking_requests,
            rejected_booking_requests: this.rejected_booking_requests,
            status: this.getStatus()
        }
    }

    getStatus() {
        if (this.accepted_booking_requests.length > 0) {
            this.accepted_booking_requests.map(async (bookingRequestId) => {
                const bookingRequest = await BookingRequest.find(bookingRequestId);
                if (this._isToday(new Date(bookingRequest.date))) {
                    return statuses.BOOKED;
                }
            });
            return statuses.AVAILABLE;
        } else if (this.providerId) {
            return statuses.AVAILABLE;
        } else {
            return statuses.UN_AVAILABLE;
        }
    }

    _isToday(someDate) {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }
 
}

const statuses = {
    AVAILABLE: 'available',
    UN_AVAILABLE: 'un_available',
    BOOKED: 'booked',
}

module.exports = { Slot, statuses};