const productModel = require("../models/productModel");

// =====================================================
// GET ALL PRODUCTS
// =====================================================

const getProducts = async (req, res) => {
  try {
    const products =
      await productModel.getAllProducts();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(
      "Get Products Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// =====================================================
// GET PRODUCT BY ID
// =====================================================

const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await productModel.getProductById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Get Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE PRODUCT - ADMIN
// =====================================================

const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      featured,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !name ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price, category and stock are required",
      });
    }

    // =================================================
    // PRICE VALIDATION
    // =================================================

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Price cannot be negative",
      });
    }

    // =================================================
    // STOCK VALIDATION
    // =================================================

    if (Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Stock cannot be negative",
      });
    }

    // =================================================
    // IMAGE URL
    // =================================================

    let imageUrl = "";

    if (req.file) {
      imageUrl =
        `/uploads/products/${req.file.filename}`;
    }

    // =================================================
    // CREATE PRODUCT
    // =================================================

    const product =
      await productModel.createProduct({
        name: name.trim(),

        description:
          description || "",

        price: Number(price),

        category:
          category.trim(),

        image_url: imageUrl,

        stock: Number(stock),

        featured:
          featured === true ||
          featured === "true",
      });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create product",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PRODUCT - ADMIN
// =====================================================

const updateProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      stock,
      featured,
    } = req.body;

    // =================================================
    // CHECK PRODUCT
    // =================================================

    const existingProduct =
      await productModel.getProductById(
        id
      );

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !name ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price, category and stock are required",
      });
    }

    // =================================================
    // PRICE VALIDATION
    // =================================================

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Price cannot be negative",
      });
    }

    // =================================================
    // STOCK VALIDATION
    // =================================================

    if (Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Stock cannot be negative",
      });
    }

    // =================================================
    // IMAGE
    // =================================================

    let imageUrl =
      existingProduct.image_url ||
      "";

    // If a new image was selected,
    // replace the old image URL
    if (req.file) {
      imageUrl =
        `/uploads/products/${req.file.filename}`;
    }

    // =================================================
    // UPDATE PRODUCT
    // =================================================

    const product =
      await productModel.updateProduct(
        id,
        {
          name: name.trim(),

          description:
            description || "",

          price: Number(price),

          category:
            category.trim(),

          image_url: imageUrl,

          stock: Number(stock),

          featured:
            featured === true ||
            featured === "true",
        }
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update product",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE PRODUCT - ADMIN
// =====================================================

const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const product =
      await productModel.deleteProduct(
        id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete product",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};