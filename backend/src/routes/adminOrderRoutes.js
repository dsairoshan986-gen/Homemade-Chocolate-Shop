const express = require("express");

const router = express.Router();

const {
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

router.get(
  "/orders",
  authMiddleware,
  getAllOrders
);

// =====================================================
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id/status
// =====================================================

router.put(
  "/orders/:id/status",
  authMiddleware,
  updateOrderStatus
);

module.exports = router;