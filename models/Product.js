const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide product name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "please provide product price"],
      maxlength: [5, "price cant be more than five digits"],
    },
    description: {
      type: String,
      required: [true, "please provide product description"],
    },
    stock: {
      type: Number,
      required: [true, "please provide product stock"],
    },
    photos: [
      {
        id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: true,
    },
    brand: {
      type: String,
      required: [true, "please add a brand"],
    },
    ratings: {
      type: String,
      default: 0,
    },
    noOfReviews: { type: String, default: 0 },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("product", productSchema);
