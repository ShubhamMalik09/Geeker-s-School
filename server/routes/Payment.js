const express = require("express");
const router = express.Router();

const { verifyPayment ,capturePayment, sendPaymentSuccessEmail} = require("../controllers/Payment");
const {auth, isStudent} = require("../middleware/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment",auth , isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail",auth , isStudent, sendPaymentSuccessEmail);

module.exports = router;