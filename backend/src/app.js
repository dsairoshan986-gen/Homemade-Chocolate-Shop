require("./config/db");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", productRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Homemade Chocolate Shop API 🍫",
  });
});

module.exports = app;