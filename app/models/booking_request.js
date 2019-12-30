const BaseModel = require('./base_model');
const mongo = require('mongodb');

class BookingRequest {

    constructor(bookingRequest) {
        this.id = bookingRequest._id.toString();
        this.providerId = bookingRequest.providerId;
        this.userId = bookingRequest.userId;
        this.slotId = bookingRequest.slotId;
        this.date = bookingRequest.date;
    }

    static async connect() {
        this.collection = await BaseModel.connect("bookingRequest");
    }
    
    static async create(bookingRequest) {
        await this.collection.insert(bookingRequest);
        return new BookingRequest(bookingRequest);
    }

    static async find(requestId) {
        const bookingRequest = await this.collection.find({ "_id": new mongo.ObjectID(requestId) }).toArray();
        return new BookingRequest(bookingRequest[0]);
    }

    static async findAll(requestIds) {
        const bookingRequests = await this.collection.find({ "_id": {
            $in : requestIds.map((requestId) => new mongo.ObjectID(requestId))
        }}).toArray();
        return bookingRequests.map((bookingRequest) => new BookingRequest(bookingRequest));
    }
}

module.exports = BookingRequest