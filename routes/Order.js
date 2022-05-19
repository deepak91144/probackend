const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const orderController = require("../controllers/OrderController");
const { isSignedIn, isAdmin } = require("../middlewares/User");
router.post(
  "/order/create",
  check("shippingInfo", "shipping info is mandatory").notEmpty(),
  check("orderItems", "order items is mandatory").notEmpty(),
  check("taxAmount", "tax amount should be a number").notEmpty().isNumeric(),
  check("shippingAmount", "shippingAmount should be a number")
    .notEmpty()
    .isNumeric(),
  check("totalAmount", "totalAmount should be a number").notEmpty().isNumeric(),

  isSignedIn,
  orderController.createOrder
);
router.get("/order/:orderId", isSignedIn, orderController.getAnOrder);
router.get("/myorder", isSignedIn, orderController.getUserOrder);
router.get(
  "/admin/order",
  isSignedIn,
  isAdmin,
  orderController.adminGetsAllOrder
);
router.put(
  "/admin/order/:orderId",
  check("orderStatus", "orderStatus  is mandatory").notEmpty(),
  isSignedIn,
  isAdmin,
  orderController.updateOrder
);
router.delete(
  "/admin/order/:orderId",
  isSignedIn,
  isAdmin,
  orderController.deleteAnOrder
);
module.exports = router;
