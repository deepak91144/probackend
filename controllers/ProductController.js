const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary");
const productModel = require("../models/Product");
exports.addPoduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(201).json(errors);
    }
    const productDetails = req.body;
    let imageArray = [];
    if (!req.files) {
      return res.status(401).json({
        message: "image is mandatory",
      });
    }
    if (Array.isArray(req.files.photos)) {
      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "product",
          }
        );

        imageArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
      productDetails.photos = imageArray;
    } else {
      let res = await cloudinary.v2.uploader.upload(
        req.files.photos.tempFilePath,
        {
          folder: "product",
        }
      );
      productDetails.photos = { id: res.public_id, secure_url: res.secure_url };
    }

    productDetails.user = req.user._id;
    const product = new productModel(productDetails);
    const newProduct = await product.save();
    return res.status(201).json({
      message: "product created successfully",
      product: newProduct,
      image: imageArray,
    });
  } catch (error) {
    return res.status(401).json(error);
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (!products) {
      return res.status(200).json({
        success: false,
        message: "no product found",
      });
    }
    return res.status(200).json({
      success: false,
      product: products,
    });
  } catch (error) {
    return res.status(200).json(error);
  }
};
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (!product) {
      return res.status(200).json({
        success: false,
        message: "no product found",
      });
    }
    return res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    return res.status(200).json(error);
  }
};
exports.adminGetsAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (!products) {
      return res.status(200).json({
        success: false,
        message: "no product found",
      });
    }
    return res.status(200).json({
      success: true,
      product: products,
    });
  } catch (error) {
    return res.status(200).json(error);
  }
};
exports.updateProduct = async (req, res) => {
  // try {
  const product = await productModel.findById(req.params.productId);
  if (!product) {
    return res.status(200).json({
      success: false,
      message: "product not found",
    });
  }
  let imagesArray = [];
  if (req.files) {
    for (let index = 0; index < product.photos.length; index) {
      const response = await cloudinary.v2.uploader.destroy(
        product.photos[index].id
      );
    }
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "product",
        }
      );
      imagesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
    re.body.photos = imagesArray;
  }

  const updatedProduct = await productModel.findOneAndUpdate(
    { _id: product._id },
    req.body,
    { new: true }
  );
  return res.status(200).json({
    success: true,
    message: "product updated succesfully",
    product: updatedProduct,
  });
  // } catch (error) {
  //   return res.status(200).json(error);
  // }
};
exports.deleteAProduct = async (req, res) => {
  // try {
  const product = await productModel.findById(req.params.productId);
  if (!product) {
    return res.status(200).json({
      success: false,
      message: "product not found",
    });
  }
  for (let index = 0; index < product.photos.length; index++) {
    const result = cloudinary.v2.uploader.destroy(product.photos[index].id);
  }
  const deletedProduct = await productModel.findOneAndDelete({
    _id: req.params.productId,
  });

  return res.status(204).json({
    success: true,
    message: "product deleted ",
  });
  // } catch (error) {
  //   return res.status(200).json(error);
  // }
};
