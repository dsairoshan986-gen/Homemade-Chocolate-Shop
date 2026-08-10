const express = require("express");

const router = express.Router();

const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// =====================================================
// GET ALL ORDERS - ADMIN
// GET /api/admin/orders
// =====================================================

router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// =====================================================
// UPDATE ORDER STATUS - ADMIN
// PUT /api/admin/orders/:id/status
// =====================================================

router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;