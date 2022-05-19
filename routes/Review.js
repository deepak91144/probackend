const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const reviewController = require("../controllers/ReviewController");
const { isSignedIn } = require("../middlewares/User");
router.post(
  "/review/add",
  [
    check("product", "product is mandatory").notEmpty(),
    check("rating", "rating is mandatory").notEmpty(),
    check("comment", "comment  is mandatory").notEmpty(),
  ],
  isSignedIn,
  reviewController.addReview
);
router.get(
  "/review/:productId",
  isSignedIn,
  reviewController.getAProductReview
);
router.delete("/review/:productId", isSignedIn, reviewController.deleteAReview);
module.exports = router;
