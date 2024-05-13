const express = require('express');
const router = express.Router();


const controller_no_auth = require("../../controller/client/no_auth");



router.post("/login", controller_no_auth.login);

module.exports = router;
