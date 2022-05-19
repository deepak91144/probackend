const { validationResult } = require("express-validator");
const reviewModel = require("../models/Review");
exports.addReview = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json(error);
  }
  const reviewDetails = req.body;
  reviewDetails.user = req.user._id;
  const isUserReviewedBefore = await reviewModel.findOne({
    product: req.body.product,
    user: reviewDetails.user,
  });

  if (isUserReviewedBefore) {
    const updatedReview = await reviewModel.findOneAndUpdate(
      {
        product: isUserReviewedBefore.product,
        user: isUserReviewedBefore.user,
      },
      reviewDetails,
      { new: true }
    );
    return res.status(201).json({
      success: true,
      message: "review success updated",
      updatedReview: updatedReview,
    });
  }
  const review = reviewModel(reviewDetails);
  const newReview = await review.save();
  return res.status(201).json({
    success: true,
    message: "review success added",
  });
};
exports.deleteAReview = async (req, res) => {
  const review = await reviewModel.findOne({ product: req.params.productId });

  if (!review) {
    return res.status(401).json({
      success: false,
      message: "review not found",
    });
  }
  const deletedReview = await reviewModel.findOneAndDelete({
    product: req.params.productId,
  });
  return res.status(204).json({
    success: true,
    message: "review deleted successfully",
  });
};
exports.getAProductReview = async (req, res) => {
  const review = await reviewModel.find({ product: req.params.productId });
  if (!review) {
    return res.status(200).json({
      success: false,
      message: "review not found",
    });
  }
  return res.status(200).json({
    success: true,
    review: review,
  });
};
