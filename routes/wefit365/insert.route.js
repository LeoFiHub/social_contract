const express = require('express');
const insertController = require("../../controller/wefit365/insert.controller");

const insertRouter = express.Router();

insertRouter.route('/createUser').post(insertController.createNewUser);

module.exports = insertRouter;