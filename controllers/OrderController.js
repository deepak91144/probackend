const { validationResult } = require("express-validator");
const orderModel = require("../models/Order");

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json(errors);
  }

  const order = new orderModel({ ...req.body, user: req.user._id });
  const newOrder = await order.save();
  return res.status(201).json({
    message: "order placed successfully",
    order: newOrder,
  });
};
exports.getAnOrder = async (req, res) => {
  const order = await orderModel
    .findById(req.params.orderId)
    .populate("user", "name email role");

  if (!order) {
    return res.status(401).json({
      success: false,
      message: "order not found",
    });
  }
  return res.status(401).json({
    success: true,
    order: order,
  });
};
exports.getUserOrder = async (req, res) => {
  const order = await orderModel
    .find(req.user._id)
    .populate("user", "name email role");

  if (!order) {
    return res.status(401).json({
      success: false,
      message: "order not found",
    });
  }
  return res.status(200).json({
    success: true,
    order: order,
  });
};
exports.adminGetsAllOrder = async (req, res) => {
  const order = await orderModel
    .find(req.user._id)
    .populate("user", "name email role");

  if (!order) {
    return res.status(401).json({
      success: false,
      message: "order not found",
    });
  }
  return res.status(200).json({
    success: true,
    order: order,
  });
};
exports.updateOrder = async (req, res) => {
  const order = await orderModel.findById(req.params.orderId);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json(errors);
  }
  if (!order) {
    return res.status(401).json({
      success: false,
      message: "order not found",
    });
  }
  const updatedOrder = await orderModel.findOneAndUpdate(
    { _id: req.params.orderId },
    { orderStatus: req.body.orderStatus },
    { new: true }
  );
  return res.status(201).json({
    success: true,
    order: updatedOrder,
  });
};
exports.deleteAnOrder = async (req, res) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) {
    return res.status(401).json({
      success: false,
      message: "order not found",
    });
  }
  const deletedOrder = await orderModel.findOneAndDelete({
    _id: req.params.orderId,
  });
  return res.status(204).json({
    success: true,
  });
};
