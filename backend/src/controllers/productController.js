const productModel = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

module.exports = {
  getProducts,
};