import React from "react";
import { Routes, Route } from "react-router-dom";

// =====================================================
// LAYOUT
// =====================================================

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// =====================================================
// HOME
// =====================================================

import Home from "./pages/Home/Home";

// =====================================================
// ABOUT
// =====================================================

import About from "./pages/About/About";

// =====================================================
// PRODUCTS
// =====================================================

import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

// =====================================================
// CART
// =====================================================

import Cart from "./pages/Cart/Cart";

// =====================================================
// CHECKOUT
// =====================================================

import Checkout from "./pages/Checkout/Checkout";

// =====================================================
// AUTH
// =====================================================

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// =====================================================
// ORDERS
// =====================================================

import Orders from "./pages/Orders/Orders";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";

// =====================================================
// NOT FOUND
// =====================================================

import NotFound from "./pages/NotFound/NotFound";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProducts from "./pages/Admin/AdminProducts";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Routes>

          {/* ================= PUBLIC ================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          {/* ================= CART ================= */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* ================= CHECKOUT ================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* ================= AUTH ================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ================= USER ORDERS ================= */}

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/order-success/:id"
            element={<OrderSuccess />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          {/* ================= 404 ================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;