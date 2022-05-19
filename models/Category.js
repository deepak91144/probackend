const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide product name"],
      trim: true,
    },

    description: {
      type: String,
    },
  },

  { timestamps: true }
);
module.exports = mongoose.model("category", categorySchema);
