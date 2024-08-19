const { recoverPublicKey } = require('ethers/lib/utils');
const express = require('express');
// const orderRoute = require('./order.route');
// const challengeRoute = require('./challenge.route')
const insertRoute = require('./wefit365/insert.route')
const readRoute = require('./wefit365/read.route')

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
// router.use('/order', orderRoute);
// router.use('/asset', challengeRoute);
router.use('/create', insertRoute);
router.use('/get', readRoute);

module.exports = router;
