const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// ========================================
// Middleware
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// API Routes
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ========================================
// Home / Health Check
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chocolate Shop API is running",
  });
});

// ========================================
// 404 Handler
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// Error Handler
// ========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// ========================================
// Start Server
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🍫 Chocolate Shop Backend");
  console.log("=================================");
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
  console.log("=================================");
});