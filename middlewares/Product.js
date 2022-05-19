const productModel = require("../models/Product");
// not a middleware, its a function to update product stock
const updateProductStock = async (productId, qty) => {
  const updatedProduct = await productModel.findOneAndUpdate(
    { _id: productId },
    { $inc: { stock: -1 } },
    { new: true }
  );
};
