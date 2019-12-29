const BaseModel = require('./base_model');
const mongo = require('mongodb');

class User {

    constructor(user, collection) {
        this.name = user.name;
        this.id = user._id;
        this.fcmAccessToken = user.fcmAccessToken;
        this.passwordDigest = user.passwordDigest;
        this.collection = collection;
    }

    static async connect() {
        this.collection = await BaseModel.connect('users');
    }

    static async find(userId) {
        const user = await this.collection.find({ "_id": new mongo.ObjectID(userId) }).toArray();
        return new User(user[0], this.collection);
    }

    static async findByName(name) {
        const user = await this.collection.find({ "name": name }).toArray();
        return new User(user[0], this.collection);
    }

    static async findByProviderId(providerId) {
        const users = await this.collection.find({ "providerId": new mongo.ObjectID(providerId) }).toArray();
        return users.map((userObj) => {
            return new User(userObj, this.collection);
        })
    }

    async updateFCMAccessToken(fcmAccessToken) {
        await this.collection.update(
            { _id: new mongo.ObjectID(this.id) },
            {
                $set: {
                    fcmAccessToken: fcmAccessToken,
                }
            }
        );
    }
}

module.exports = User;