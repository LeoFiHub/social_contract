const cron = require('node-cron');
const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;

cron.schedule('*/10 * * * * *', async function () {
    console.log("Running a task every 10 seconds");

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    // Read lay tap user tu db

    // Looop tap user thanh tung item => goi api backend tinh cash back

    // Update user to db

    try {
        // Update data logic

    } catch (err) {
        console.log(err.message)
    }

    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});