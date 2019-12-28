const BaseModel = require('./base_model');
const mongo = require('mongodb');

class User {

    constructor(user, collection) {
        this.name = user.name;
        this.id = user._id;
        this.accessToken = user.accessToken;
        this.passwordDigest = user.passwordDigest;
        this.collection = collection;
    }

    static async connect() {
        this.collection = await BaseModel.connect('users');
    }

    static async find(userId) {
        const user = await this.collection.find({ "_id": new mongo.ObjectID(userId) }).toArray();
        debugger;
        return new User(user[0], this.collection);
    }

    static async findByName(name) {
        const user = await this.collection.find({ "name": name }).toArray();
        return new User(user[0], this.collection);
    }

    async updateFCMAccessToken(accessToken) {
        debugger;
        await this.collection.update(
            { _id: new mongo.ObjectID(this.id) },
            {
                $set: {
                    fcmAccessToken: accessToken,
                }
            }
        );
    }
}

module.exports = User;