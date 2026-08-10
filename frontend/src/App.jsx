import { Navigate, Routes, Route } from "react-router-dom";

// =====================================================
// LAYOUT
// =====================================================

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// =====================================================
// CUSTOMER PAGES
// =====================================================

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Orders from "./pages/Orders/Orders";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";

// =====================================================
// AUTH PAGES
// =====================================================

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProducts from "./pages/Admin/AdminProducts";

// =====================================================
// 404 PAGE
// =====================================================

import NotFound from "./pages/NotFound/NotFound";

// =====================================================
// PROTECTED ADMIN ROUTE
// =====================================================

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");

  // ---------------------------------------------------
  // User is not logged in
  // ---------------------------------------------------

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ---------------------------------------------------
  // User is logged in
  // ---------------------------------------------------

  return children;
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <Route
          path="/products"
          element={<Products />}
        />

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            CART
        ================================================= */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* =================================================
            CHECKOUT
        ================================================= */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* =================================================
            CUSTOMER ORDERS
        ================================================= */}

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* =================================================
            ORDER SUCCESS
        ================================================= */}

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />

        {/* =================================================
            ADMIN DASHBOARD
            PROTECTED
        ================================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* =================================================
            ADMIN ORDERS
            PROTECTED
        ================================================= */}

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />

        {/* =================================================
            ADMIN PRODUCTS
            PROTECTED
        ================================================= */}

        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <AdminProducts />
            </ProtectedAdminRoute>
          }
        />

        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </>
  );
}

export default App;