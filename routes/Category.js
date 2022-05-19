const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const categoryController = require("../controllers/CategoryController");
const { isSignedIn, isAdmin } = require("../middlewares/User");
router.post(
  "/category/add",
  [check("name", "category name is mandatory").notEmpty()],
  isSignedIn,
  isAdmin,
  categoryController.addCategory
);
router.get("/category", isSignedIn, isAdmin, categoryController.getCategories);
router.put(
  "/category/update/:categoryId",
  isSignedIn,
  isAdmin,
  categoryController.updateCategory
);
router.delete(
  "/category/delete/:categoryId",
  isSignedIn,
  isAdmin,
  categoryController.deleteCategory
);
module.exports = router;
