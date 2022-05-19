const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qunatity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        require: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
  },
  taxAmount: { type: Number, required: true },
  shippingAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, required: true, default: "proccessing" },
  deliveredAt: {
    type: Date,
  },
});
module.exports = new mongoose.model("order", orderSchema);
