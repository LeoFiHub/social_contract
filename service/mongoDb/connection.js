const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;

let client;

exports.connectToDatabase = async () => {
    if (!client) {
        client = new MongoClient(MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        await client.connect();
    }
    return client;
}