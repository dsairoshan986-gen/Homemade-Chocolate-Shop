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

const getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
};