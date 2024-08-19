const { insertUser } = require('../../service/mongoDb/insert');
const { connectToDatabase } = require('../../service/mongoDb/connection');
const { logger } = require('../../config/logger');

exports.createNewUser = async (req, res, next) => {
    try {
        const client = await connectToDatabase();

        let request = {
            userEmail: req.body.userEmail,
            createdAt: req.body.createdAt,
            balance: 0,
            typeofMember: 'beginner',
            maxSteps: 10000
        };
        let resp = await insertUser(client, request);

        res.json({
            code: 0,
            data: resp
        });
    } catch (err) {
        logger.info("Create user error: ", err.message);
        next(err);
    }
}