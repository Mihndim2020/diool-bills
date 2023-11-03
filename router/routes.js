const express = require("express");
const xmlPages = require("../controllers/controllers.js");

const router = express.Router();

router.get("/", xmlPages.index);

router.get("/checkBill", xmlPages.checkBill)

router.get("/settleRfp", xmlPages.settleRfp)

router.get("/quit", xmlPages.quit)

module.exports = router;