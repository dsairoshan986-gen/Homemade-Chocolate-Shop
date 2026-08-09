const express = require("express");
const pool = require("../config/db");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// =====================================================
// ADMIN TEST ROUTE
// =====================================================

router.get(
  "/test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Admin API is working successfully",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);


// =====================================================
// ADMIN DASHBOARD STATISTICS
// =====================================================

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Total products
      const productsResult = await pool.query(
        "SELECT COUNT(*) AS total FROM products"
      );

      // Total orders
      const ordersResult = await pool.query(
        "SELECT COUNT(*) AS total FROM orders"
      );

      // Total customers
      const customersResult = await pool.query(
        "SELECT COUNT(*) AS total FROM users WHERE role = 'customer'"
      );

      // Total revenue
      const revenueResult = await pool.query(
        "SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders"
      );


      const totalProducts = Number(
        productsResult.rows[0].total
      );

      const totalOrders = Number(
        ordersResult.rows[0].total
      );

      const totalCustomers = Number(
        customersResult.rows[0].total
      );

      const totalRevenue = Number(
        revenueResult.rows[0].total
      );


      return res.status(200).json({
        success: true,

        data: {
          totalProducts,
          totalOrders,
          totalCustomers,
          totalRevenue,
        },
      });

    } catch (error) {
      console.error("Admin Stats Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin statistics",
        error: error.message,
      });
    }
  }
);


module.exports = router;