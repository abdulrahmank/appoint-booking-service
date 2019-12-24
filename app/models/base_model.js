const MongoClient = require('mongodb').MongoClient

class BaseModel {
    static async connect(collectionName) {
        const client = await MongoClient.connect(process.env.MONGO_DB_URL, { useUnifiedTopology: true });
        return client.db(process.env.MONGO_DB).collection(collectionName);
    }
}

module.exports = BaseModel