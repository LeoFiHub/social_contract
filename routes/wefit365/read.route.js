const express = require('express');
const readController = require("../../controller/wefit365/read.controller");

const readRouter = express.Router();

readRouter.route("/getUser").get(readController.getUserByEmail);

module.exports = readRouter;