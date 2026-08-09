const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================

router.post(
  "/",
  authMiddleware,
  orderController.createOrder
);


// ==========================================
// GET MY ORDERS
// GET /api/orders
// ==========================================

router.get(
  "/",
  authMiddleware,
  orderController.getOrders
);


module.exports = router;