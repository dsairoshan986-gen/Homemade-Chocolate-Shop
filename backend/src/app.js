const express = require("express");
const cors = require("cors");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

// =====================================================
// CREATE APP
// =====================================================

const app = express();

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "APP.JS IS DEFINITELY RUNNING",
  });
});

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// =====================================================
// BODY PARSERS
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Homemade Chocolate Shop API is running",
  });
});

// =====================================================
// API ROUTES
// =====================================================

// -----------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------

app.use("/api/auth", authRoutes);

// -----------------------------------------------------
// PRODUCTS
// -----------------------------------------------------

app.use("/api/products", productRoutes);

// -----------------------------------------------------
// CUSTOMER ORDERS
// -----------------------------------------------------

app.use("/api/orders", orderRoutes);

// -----------------------------------------------------
// ADMIN GENERAL ROUTES
// /api/admin/test
// /api/admin/stats
// -----------------------------------------------------

app.use("/api/admin", adminRoutes);

// -----------------------------------------------------
// ADMIN ORDER ROUTES
// /api/admin/orders
// /api/admin/orders/:id/status
// -----------------------------------------------------

app.use("/api/admin", adminOrderRoutes);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:");
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal server error",

    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.stack,
  });
});

// =====================================================
// EXPORT APP
// =====================================================

module.exports = app;