const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// CREATE ORDER
// POST /api/orders
// =====================================================
router.post(
  "/",
  authMiddleware,
  createOrder
);

// =====================================================
// GET MY ORDERS
// GET /api/orders
// =====================================================
router.get(
  "/",
  authMiddleware,
  getOrders
);

module.exports = router;