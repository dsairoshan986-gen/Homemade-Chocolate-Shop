const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLER
// =====================================================

const productController = require("../controllers/productController");

// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const upload = require("../middleware/uploadMiddleware");

// =====================================================
// PUBLIC PRODUCT ROUTES
// =====================================================

// -----------------------------------------------------
// GET ALL PRODUCTS
// GET /api/products
// -----------------------------------------------------

router.get(
  "/",
  productController.getProducts
);

// -----------------------------------------------------
// GET PRODUCT BY ID
// GET /api/products/:id
// -----------------------------------------------------

router.get(
  "/:id",
  productController.getProductById
);

// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================

// -----------------------------------------------------
// CREATE PRODUCT
// POST /api/products
// -----------------------------------------------------

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  productController.createProduct
);

// -----------------------------------------------------
// UPDATE PRODUCT
// PUT /api/products/:id
// -----------------------------------------------------

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  productController.updateProduct
);

// -----------------------------------------------------
// DELETE PRODUCT
// DELETE /api/products/:id
// -----------------------------------------------------

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;