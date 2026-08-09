const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// =====================================================
// PUBLIC PRODUCT ROUTES
// =====================================================

// Get all products
router.get(
  "/",
  productController.getProducts
);


// Get product by ID
router.get(
  "/:id",
  productController.getProductById
);


// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================

// Create product
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);


// Update product
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);


// Delete product
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);


module.exports = router;