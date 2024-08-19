const dbName = "wefit365";

exports.updateUserByEmail = async (client, emailUser, updatedUser) => {
    const result = await client.db(dbName).collection('users')
        .updateOne({ email: emailUser }, { $set: updatedUser });

    console.log(`${result.matchedCount} user(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} user(s) was/were updated.`);
}

exports.upsertUserByEmail = async (client, emailUser, updatedUser) => {
    const result = await client.db(dbName).collection('users')
        .updateOne(
            { email: emailUser },
            { $set: updatedUser },
            { upsert: true }
        );
    console.log(`${result.matchedCount} user(s) matched the query criteria.`);

    if (result.upsertedCount > 0) {
        console.log(`One user was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} user(s) was/were updated.`);
    }
}

exports.updateAllActivitiesToHavePropertyType = async (client) => {
    const result = await client.db(dbName).collection('activities')
        .updateMany({ txHash: { $exists: false } },
            { $set: { txHash: "0x...", isClaimed: true } });
    console.log(`${result.matchedCount} activity(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} activity(s) was/were updated.`);
}