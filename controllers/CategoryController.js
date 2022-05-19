const { validationResult } = require("express-validator");
const categoryModel = require("../models/Category");
exports.addCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(201).json(errors);
    }

    const category = new categoryModel(req.body);
    const newCategory = await category.save();
    return res.status(201).json({
      message: "category created successfully",
      category: category,
    });
  } catch (error) {
    return res.status(401).json(error);
  }
};
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    return res.status(200).json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    return res.status(200).json(error);
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.categoryId);
    if (!category) {
      return res.json({
        success: false,
        message: "category doesnt exist",
      });
    }
    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id: req.params.categoryId },
      req.body,
      { new: true }
    );
    return res.status(201).json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    return res.status(201).json(error);
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.categoryId);
    if (!category) {
      return res.json({
        success: false,
        message: "category doesnt exist",
      });
    }
    const deletedCategory = await categoryModel.findOneAndDelete({
      _id: req.params.categoryId,
    });
    return res.status(204).json({
      message: "fjrej",
    });
  } catch (error) {
    return res.stat(402).json(error);
  }
};
