const express    = require("express");
const router     = express.Router();
const controller = require('../controllers/zCashControllers');

router.post("/transaction/send",controller.sendTransaction);

router.get("/transaction/fee", controller.getTransactionFee);

router.get("/transaction/info/:txID",controller.getTransaction);

router.get("/user/balance/:address",controller.getUserBalance);

router.get("/user/address/generate",controller.generateUserAddress);

module.exports = router;
