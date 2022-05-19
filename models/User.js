const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      id: { type: String },
      securedUrl: { type: String },
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordexpiry: Date,
  },
  { timestamps: true }
);
// encrypt password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
// validate the password with passed on user password
userSchema.methods.isPasswordValidated = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};
// create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
userSchema.methods.getForgotPasswordToken = async function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  //   getting a has-make sure to get a hash on backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  // time on token
  this.forgotPasswordexpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken;
};
module.exports = mongoose.model("user", userSchema);
