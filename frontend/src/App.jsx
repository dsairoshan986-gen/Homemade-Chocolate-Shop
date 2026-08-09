import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ========================================
// LAYOUT
// ========================================
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ========================================
// HOME
// ========================================
import Home from "./pages/Home/Home";

// ========================================
// CUSTOMER PAGES
// ========================================
import About from "./pages/About/About";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

// ========================================
// AUTHENTICATION
// ========================================
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// ========================================
// ORDERS
// ========================================
import Orders from "./pages/Orders/Orders";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";

// ========================================
// ADMIN
// ========================================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";

// ========================================
// 404
// ========================================
import NotFound from "./pages/NotFound/NotFound";

// ========================================
// CSS
// ========================================
import "./App.css";


function App() {
  return (
    <BrowserRouter>

      {/* ==================================
          NAVBAR
      ================================== */}
      <Navbar />


      {/* ==================================
          MAIN CONTENT
      ================================== */}
      <main>

        <Routes>

          {/* ==================================
              HOME
          ================================== */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* ==================================
              CUSTOMER PAGES
          ================================== */}

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

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />


          {/* ==================================
              AUTHENTICATION
          ================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ==================================
              CUSTOMER ORDERS
          ================================== */}

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/order-success/:id"
            element={<OrderSuccess />}
          />


          {/* ==================================
              ADMIN DASHBOARD
          ================================== */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />


          {/* ==================================
              ADMIN PRODUCT MANAGEMENT
          ================================== */}

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />


          {/* ==================================
              404
          ================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </main>


      {/* ==================================
          FOOTER
      ================================== */}

      <Footer />

    </BrowserRouter>
  );
}


export default App;