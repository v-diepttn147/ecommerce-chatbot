const express    = require("express");
const router     = express.Router();
const controller = require('../controllers/bitcoinControllers');

router.post("/transaction/send",controller.sendTransaction);

router.get("/transaction/info/:txID",controller.getTransaction);

router.get("/user/balance/:address",controller.getUserBalance);

router.get("/user/address/generate",controller.generateUserAddress);

module.exports = router;
