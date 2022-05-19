const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },

    rating: {
      type: Number,
    },
    averageRating: {
      type: Number,
    },
    comment: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);
module.exports = mongoose.model("review", reviewSchema);
