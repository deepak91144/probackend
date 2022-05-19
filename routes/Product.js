const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const productController = require("../controllers/ProductController");
const { isSignedIn, isAdmin } = require("../middlewares/User");
router.post(
  "/product/add",
  [
    check("name", "product name is minimum two charcater").isLength({ min: 2 }),
    check("price", "price is a numeric field").notEmpty().isNumeric(),
    check("description", "description is minimum 10 characterr").isLength({
      min: 10,
    }),
    check("stock", "stock field should be a numeric").notEmpty().isNumeric(),
    check("category", "category is mandatory").notEmpty(),
    check("brand", "brand is mandatory").notEmpty(),
    check("user", "user is mandatory").notEmpty(),
  ],
  isSignedIn,
  isAdmin,
  productController.addPoduct
);
router.get("/product", productController.getAllProducts);
router.get("/product/single/:productId", productController.getSingleProduct);
router.put(
  "/admin/product/update/:productId",
  isSignedIn,
  isAdmin,
  productController.updateProduct
);
router.get(
  "/admin/product",
  isSignedIn,
  isAdmin,
  productController.adminGetsAllProducts
);
router.put(
  "/admin/product/update/:productId",
  isSignedIn,
  isAdmin,
  productController.updateProduct
);
router.delete(
  "/admin/product/delete/:productId",
  isSignedIn,
  isAdmin,
  productController.deleteAProduct
);
module.exports = router;
