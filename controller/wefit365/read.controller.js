const { connectToDatabase } = require('../../service/mongoDb/connection');
const { logger } = require('../../config/logger');
const { findUserByEmail } = require('../../service/mongoDb/read');

exports.getUserByEmail = async (req, res, next) => {
    try {
        const client = await connectToDatabase();

        let request = {
            email: req.query.userEmail,
        }

        let resp = await findUserByEmail(client, request.email);
        res.json({
            code: 0,
            data: resp
        })
    } catch (err) {
        logger.info("Get user by email error: ", err.message)
        next(err)
    }
}