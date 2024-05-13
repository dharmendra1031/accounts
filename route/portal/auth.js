const express = require('express');
const router = express.Router();




const controller_auth = require("../../controller/portal/auth");

router.post("/user/disable",controller_auth.disable_user);
router.post("/user/enable", controller_auth.enable_user);
router.post("/user/delete", controller_auth.delete_user);
router.get("/user/list", controller_auth.get_user_list);
router.post("/user/get", controller_auth.get_user);
router.get("/transactions", controller_auth.get_transactions);


module.exports = router;
