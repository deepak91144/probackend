const { validationResult } = require("express-validator");
const userModel = require("../models/User");
const cookieToken = require("../utils/CookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const nodeMailer = require("../utils/EmailHelper");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ error: errors.mapped() });
    }
    let userDetails = req.body;
    const isEmailExist = await userModel.findOne({ email: userDetails.email });
    if (isEmailExist) {
      res.status(200).json({
        message: "email exist before",
      });
    }

    let result;
    if (req.files) {
      let file = req.files.photo;

      result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });

      userDetails.photo = {
        id: result.public_id,
        securedUrl: result.secure_url,
      };
    }
    userDetails.role = "admin";
    const user = new userModel(userDetails);
    const newUser = await user.save();
    cookieToken(user, newUser, res);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong,try later",
    });
  }
};
exports.signin = async (req, res) => {
  try {
    // getting error if any
    const errors = validationResult(req);

    // sending error as response
    if (!errors.isEmpty()) {
      return res.status(401).json({
        error: errors.mapped(),
      });
    }
    // getting email and password from client
    const { email, password } = req.body;
    // find user details
    const user = await userModel.findOne({ email: email }).select("+password");

    // if user doesnt exist send him response accordingly
    if (!user) {
      return res.status(404).json({
        message: "user dosent exist",
      });
    }
    // if password doesnt match send response accordingly
    const isPasswordMatched = await user.isPasswordValidated(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "invalid email or password",
      });
    }
    // send cookie response

    cookieToken(user, user, res);
  } catch (error) {
    return res.status(401).json({
      error: error,
    });
  }
};
exports.signout = (req, res) => {
  // null the cookie value
  res.cookie("token", null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({
    message: "signout successfully",
  });
};
exports.forgotPassword = async (req, res) => {
  // getting error if any
  const errors = validationResult(req);

  // sending error as response
  if (!errors.isEmpty()) {
    return res.status(401).json({
      error: errors.mapped(),
    });
  }
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(404).json({
      message: "email is not registred",
    });
  }
  // const forgotToken = user.getForgotPasswordToken();
  const forgotToken = crypto.randomBytes(20).toString("hex");
  //   getting a has-make sure to get a hash on backend
  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  // time on token
  const forgotPasswordexpiry = Date.now() + 20 * 60 * 1000;

  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;
  const message = `copy paste this link in your url and hit enter /n/n ${url}`;
  const response = await nodeMailer({
    email: email,
    subject: "pro backend course",
    text: message,
  });
  if (response) {
    await userModel.findOneAndUpdate(
      { email: email },
      {
        forgotPasswordToken: forgotPasswordToken,
        forgotPasswordexpiry: forgotPasswordexpiry,
      }
    );
  }
  console.log(response);
  return res.status(404).json({
    message: "email sent successfully",
  });
};
exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json(errors.mapped());
    }
    const token = req.params.token;
    const encryptedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await userModel.findOne({
      forgotPasswordToken: encryptedToken,
      forgotPasswordexpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        message: "Either token invalid or expired",
      });
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        message: "password and reset password are not same",
      });
    }
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      {
        password: await bcrypt.hash(req.body.password, 10),
        forgotPasswordToken: null,
        forgotPasswordexpiry: null,
      },
      {
        new: true,
      }
    );

    cookieToken(updatedUser, updatedUser, res);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
exports.getLoggedInUserDetails = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  return res.status(200).json({
    user: user,
  });
};
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json(errors.mapped());
    }
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById(req.user._id).select("+password");
    // return res.json(user);
    const isCorrectOldPassword = await user.isPasswordValidated(oldPassword);
    if (!isCorrectOldPassword) {
      return res.status(404).json({
        message: "old password is incorrect",
      });
    }
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      { password: await bcrypt.hash(newPassword, 10) },
      { new: true }
    );
    cookieToken(updatedUser, updatedUser, res);
  } catch (error) {
    return res.status(404).json({ error });
  }
};
exports.updateUserDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json(errors.mapped());
    }
    const userDetails = req.body;
    let result;
    if (req.files) {
      const user = await userModel.findById(req.user._id);
      // check if phot exist
      if (user.photo) {
        const resp = await cloudinary.v2.uploader.destroy(user.photo.id);
      }
      let file = req.files.photo;

      result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });

      userDetails.photo = {
        id: result.public_id,
        securedUrl: result.secure_url,
      };
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      userDetails,
      { new: true }
    );
    return res.status(201).json({
      message: "user update successfull",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(404).json({ error });
  }
};
exports.getUsersForAdmin = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json({
      users: allUsers,
    });
  } catch (error) {
    return res.status(404).json({ error });
  }
};
exports.getUsersForManager = async (req, res) => {
  try {
    const allUsers = await userModel.find({ role: "user" });
    res.status(200).json({
      users: allUsers,
    });
  } catch (error) {
    return res.status(404).json({ error });
  }
};
exports.getAUserForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const allUsers = await userModel.findById(userId);
    res.status(200).json({
      users: allUsers,
    });
  } catch (error) {
    return res.status(404).json(error);
  }
};
exports.adminUpdatesAnUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json(errors.mapped());
    }
    const user = await userModel.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "user doesnt exist" });
    }
    const userDetails = req.body;
    let result;

    if (req.files) {
      const user = await userModel.findById(req.params.userId);

      // check if phot exist
      if (user.photo.id) {
        const resp = await cloudinary.v2.uploader.destroy(user.photo.id);
      }

      let file = req.files.photo;

      result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });

      userDetails.photo = {
        id: result.public_id,
        securedUrl: result.secure_url,
      };
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.userId },
      userDetails,
      { new: true }
    );
    return res.status(201).json({
      message: "user update successfull",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
exports.admindeletsAnUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "user doesnt exist" });
    }
    const deletedUser = await userModel.findOneAndDelete({ _id: user._id });

    // check if phot exist
    if (user.photo.id) {
      const resp = await cloudinary.v2.uploader.destroy(user.photo.id);
    }

    return res.status(204).json({ message: deletedUser });
  } catch (error) {
    return res.json(400).json(error);
  }
};
