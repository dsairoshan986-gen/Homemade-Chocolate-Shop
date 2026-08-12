const express = require("express");

const router = express.Router();

// =====================================================
// CONTROLLERS
// =====================================================

const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// =====================================================
// GET ALL ORDERS - ADMIN ONLY
// GET /api/admin/orders
// =====================================================

router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// =====================================================
// UPDATE ORDER STATUS - ADMIN ONLY
// PUT /api/admin/orders/:id/status
// =====================================================

router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;