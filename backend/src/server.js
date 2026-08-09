const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();


// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");


// =====================================================
// APP
// =====================================================

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));


// =====================================================
// BASIC TEST ROUTE
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

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Products
app.use(
  "/api/products",
  productRoutes
);

// Customer Orders
app.use(
  "/api/orders",
  orderRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);


// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});


// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});