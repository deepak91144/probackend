const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/UserController");
const { isSignedIn, isAdmin, isManager } = require("../middlewares/User");
router.post(
  "/signup",
  [
    check("name", "minimum length is two charcater").isLength({ min: 2 }),
    check("email", "invalid email").isEmail(),
    check("password", "password is minimum 5 characterr").isLength({ min: 5 }),
  ],
  userController.signup
);
router.post(
  "/signin",
  [
    check("email", "invalid email").isEmail(),
    check("password", "password is mandatory").notEmpty(),
  ],
  userController.signin
);
router.get("/signout", userController.signout);
router.post(
  "/forgot-password",
  [check("email", "invalid email").isEmail()],
  userController.forgotPassword
);
router.post(
  "/password/reset/:token",
  [
    check("password", "password is required").notEmpty(),
    check("confirmPassword", "confirm password is required").notEmpty(),
  ],
  userController.resetPassword
);
router.get("/userdashboard", isSignedIn, userController.getLoggedInUserDetails);
router.post(
  "/password/change",
  [
    check("oldPassword", "old password is required").notEmpty(),
    check("newPassword", "new password is required").notEmpty(),
  ],
  isSignedIn,
  userController.changePassword
);
router.put(
  "/user/update",
  [
    check("name", "name is mandatory").notEmpty(),
    check("email", "invalid email").isEmail(),
  ],
  isSignedIn,
  userController.updateUserDetails
);
router.get(
  "/admin/users",
  isSignedIn,
  isAdmin,
  userController.getUsersForAdmin
);
router.get(
  "/manager/users",
  isSignedIn,
  isManager,
  userController.getUsersForManager
);
router.get(
  "/admin/singleUser/:userId",
  isSignedIn,
  isAdmin,
  userController.getAUserForAdmin
);
router.put(
  "/admin/user/update/:userId",
  [
    check("name", "name is mandatory").notEmpty(),
    check("email", "invalid email").isEmail(),
  ],
  isSignedIn,
  isAdmin,
  userController.adminUpdatesAnUser
);
router.delete("/admin/user/delete/:userId", userController.admindeletsAnUser);
module.exports = router;
