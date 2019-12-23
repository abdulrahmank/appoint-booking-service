const MongoClient = require('mongodb').MongoClient

class BaseModel {
    async connect() {
        const client = await MongoClient.connect(process.env.MONGO_DB_URL);
        this.collection = client.db(process.env.MONGO_DB).collection(this.getCollectionName());
    }

    getCollectionName() {
        return ''
    }
}

module.exports = BaseModel;