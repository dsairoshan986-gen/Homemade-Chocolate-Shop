require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


// ========================================
// Middleware
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// API Routes
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);


// ========================================
// Home Route
// ========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chocolate Shop API is running",
  });
});


// ========================================
// 404 Route
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// ========================================
// Server
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log("🍫 Chocolate Shop Backend");
  console.log("======================================");
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
  console.log(`Orders API: http://localhost:${PORT}/api/orders`);
  console.log("======================================");
});