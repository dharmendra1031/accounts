const express = require('express');
const router = express.Router();

const controller_auth = require("../../controller/client/auth");

router.post("/deposit", controller_auth.deposit);
router.post("/withdrawals", controller_auth.withdrawals);
router.post("/add-bonus", controller_auth.addBonus);

module.exports = router;
