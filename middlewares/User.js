const jwt = require("jsonwebtoken");
const userModel = require("../models/User");
exports.isSignedIn = async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(404).json({
      message: "login first",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await userModel.findById(decoded.id);
  next();
};
exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(404).json({
      message: "you are not admin",
    });
  }
  next();
};
exports.isManager = async (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(404).json({
      message: "you are not manager",
    });
  }
  next();
};
