const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/PaymentController");
const { check } = require("express-validator");
const { isSignedIn } = require("../middlewares/User");
router.get("/stripekey", isSignedIn, paymentController.sendStripeKey);
router.get("/razorpaykey", isSignedIn, paymentController.sendRazorpayKey);
router.post(
  "/stripepayment",
  [check("amount", "amount is required")],

  isSignedIn,
  paymentController.captureSripePayment
);
router.post(
  "/razorpaypayment",
  [check("amount", "amount is required")],
  isSignedIn,
  paymentController.captureRazorpayPayment
);
module.exports = router;
