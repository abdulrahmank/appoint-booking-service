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
        desiredRequestState[`slots.$.${status}_booking_requests`] = bookingRequestId;
        await Promise.all([
            this.collection.updateOne({
                "_id": new mongo.ObjectID(providerId),
                "slots._id": new mongo.ObjectID(slotId)
            }, {
                $pull : {
                    'slots.$.pending_booking_requests': bookingRequestId
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

    static async isAvailable(slot, date) {
        if (slot.accepted_booking_requests.length == 0) {
            return true;
        } else {
            const slotStatus = await Slot.
                _checkGivenDateAppointment(slot.accepted_booking_requests, new Date(date));
            debugger;
            return slotStatus == statuses.AVAILABLE;
        }
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

    async getStatus() {
        if (this.accepted_booking_requests.length > 0) {
            const status = await Slot._checkGivenDateAppointment(this.accepted_booking_requests, new Date())
            return status;
        } else if (this.providerId) {
            return statuses.AVAILABLE;
        } else {
            return statuses.UN_AVAILABLE;
        }
    }

    static _isSameday(date1, date2) {
        return date1.getDate() == date2.getDate() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getFullYear() == date2.getFullYear()
    }

    static async _checkGivenDateAppointment(accepted_booking_requests, date) {
        await BookingRequest.connect();
        const bookingRequests = await BookingRequest.findAll(accepted_booking_requests);
        for(var i = 0; i < bookingRequests.length; i++) {
            if (Slot._isSameday(new Date(bookingRequests[i].date), date)) {
                return statuses.BOOKED;
            }
        }
        return statuses.AVAILABLE;
    }
 
}

const statuses = {
    AVAILABLE: 'available',
    UN_AVAILABLE: 'un_available',
    BOOKED: 'booked',
}

module.exports = { Slot, statuses};