const BaseModel = require('./base_model')

class BookingRequest {

    constructor(bookingRequest) {
        this.id = bookingRequest._id.toString();
        this.providerId = bookingRequest.providerId;
        this.userId = bookingRequest.userId;
        this.slotId = bookingRequest.slotId;
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
        return new BookingRequest(bookingRequest);
    }
}

module.exports = BookingRequest