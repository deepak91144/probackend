const { validationResult } = require("express-validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.sendStripeKey = (req, res) => {
  res.status(200).json({
    stripeKey: process.env.STRIPE_API_KEY,
  });
};
exports.captureSripePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json(errors);
  }
  const payment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    // optional
    metadata: { integration_check: "accept_a_payment" },
  });
  res.status(200).json({
    success: true,
    client_secret: payment.client_secret,
  });
};
exports.sendRazorpayKey = (req, res) => {
  res.status(200).json({
    stripeKey: process.env.RAZORPAY_API_KEY,
  });
};
exports.captureRazorpayPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json(errors);
  }
  var instance = new Razorpay({
    key_id: RAZORPAY_API_KEY,
    key_secret: STRIPE_SECRET_KEY,
  });
  const options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: "order_reptid_11",
  };
  const myOrder = await instance.orders.create(options);
  return res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  });
};
