import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Orders from "./pages/Orders/Orders";

import NotFound from "./pages/NotFound/NotFound";

import "./App.css";


// ==========================================
// NAVBAR
// ==========================================

function Navbar() {
  const token = localStorage.getItem("token");

  let cart = [];

  try {
    cart = JSON.parse(
      localStorage.getItem("chocolate_cart") || "[]"
    );
  } catch (error) {
    cart = [];
  }

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link to="/" className="navbar-logo">
          🍫 Chocolate Shop
        </Link>


        {/* NAVIGATION */}

        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart">
            🛒 Cart

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>


          {/* MY ORDERS */}

          {token && (
            <Link to="/orders">
              📦 My Orders
            </Link>
          )}


          {/* LOGIN */}

          {!token && (
            <Link to="/login">
              👤 Login
            </Link>
          )}

        </div>

      </div>

    </nav>
  );
}


// ==========================================
// APP
// ==========================================

function App() {

  return (
    <>

      {/* ================================== */}
      {/* NAVBAR */}
      {/* ================================== */}

      <Navbar />


      {/* ================================== */}
      {/* ROUTES */}
      {/* ================================== */}

      <Routes>

        {/* ================================== */}
        {/* HOME */}
        {/* ================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ================================== */}
        {/* ABOUT */}
        {/* ================================== */}

        <Route
          path="/about"
          element={<About />}
        />


        {/* ================================== */}
        {/* PRODUCTS */}
        {/* ================================== */}

        <Route
          path="/products"
          element={<Products />}
        />


        {/* ================================== */}
        {/* PRODUCT DETAILS */}
        {/* ================================== */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />


        {/* ================================== */}
        {/* CART */}
        {/* ================================== */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* ================================== */}
        {/* CHECKOUT */}
        {/* ================================== */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ================================== */}
        {/* ORDER SUCCESS */}
        {/* ================================== */}

        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />


        {/* ================================== */}
        {/* MY ORDERS */}
        {/* ================================== */}

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* ================================== */}
        {/* LOGIN */}
        {/* ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================================== */}
        {/* REGISTER */}
        {/* ================================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================== */}
        {/* 404 PAGE */}
        {/* ================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </>
  );
}


export default App;