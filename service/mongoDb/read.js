const dbName = "wefit365";

exports.findActivitiesByEmailAndDate = async (client, userEmail, date) => {
    const cursor = client.db(dbName).collection("activities").find({ email: userEmail, date: date });
    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found activity(s) with email '${userEmail}' and date '${date}':`);
        results.forEach((result, i) => {
            date = new Date(result.date).toDateString();

            console.log();
            console.log(`${i + 1}. Type: ${result.typeOf}`);
            console.log(`   step: ${result.step}`);
            console.log(`   status: ${result.status}`);

        });
    } else {
        console.log(`No activities found with email '${userEmail}' and date '${date}'`);
    }
}

exports.findUserByEmail = async (client, emailUser) => {
    const collection = client.db(dbName).collection('users');

    try {
        const result = await collection.findOne({ email: emailUser });
        if (result) {
            console.log(`Found a user in the collection with the email '${emailUser}':`);
            console.log(result);
            return result;
        } else {
            console.log(`No users found with the email '${emailUser}'`);
            throw new Error(`No users found with the email '${emailUser}'`);
        }
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}