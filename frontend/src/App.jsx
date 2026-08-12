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
// CUSTOMER ACCOUNT PAGES
// =====================================================

import Profile from "./pages/Profile/Profile";
import Wishlist from "./pages/Wishlist/Wishlist";

// =====================================================
// CONTACT SUPPORT
// =====================================================

import ContactSupport from "./pages/ContactSupport/ContactSupport";

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
// PROTECTED CUSTOMER ROUTE
// =====================================================

function ProtectedCustomerRoute({ children }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // ---------------------------------------------------
  // User is not logged in
  // ---------------------------------------------------

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =====================================================
// PROTECTED ADMIN ROUTE
// =====================================================

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // ---------------------------------------------------
  // User is not logged in
  // ---------------------------------------------------

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  // ---------------------------------------------------
  // Check user information
  // ---------------------------------------------------

  try {
    const user = JSON.parse(userData);

    // -------------------------------------------------
    // Only admin can access admin pages
    // -------------------------------------------------

    if (user.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
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
          element={
            <ProtectedCustomerRoute>
              <Cart />
            </ProtectedCustomerRoute>
          }
        />

        {/* =================================================
            CHECKOUT
        ================================================= */}

        <Route
          path="/checkout"
          element={
            <ProtectedCustomerRoute>
              <Checkout />
            </ProtectedCustomerRoute>
          }
        />

        {/* =================================================
            CUSTOMER ORDERS
        ================================================= */}

        <Route
          path="/orders"
          element={
            <ProtectedCustomerRoute>
              <Orders />
            </ProtectedCustomerRoute>
          }
        />

        {/* =================================================
            ORDER SUCCESS
        ================================================= */}

        <Route
          path="/order-success"
          element={
            <ProtectedCustomerRoute>
              <OrderSuccess />
            </ProtectedCustomerRoute>
          }
        />

        <Route
          path="/order-success/:id"
          element={
            <ProtectedCustomerRoute>
              <OrderSuccess />
            </ProtectedCustomerRoute>
          }
        />

        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedCustomerRoute>
              <Profile />
            </ProtectedCustomerRoute>
          }
        />

        {/* =================================================
            WISHLIST
        ================================================= */}

        <Route
          path="/wishlist"
          element={
            <ProtectedCustomerRoute>
              <Wishlist />
            </ProtectedCustomerRoute>
          }
        />

        {/* =================================================
            CONTACT SUPPORT
        ================================================= */}

        <Route
          path="/contact-support"
          element={<ContactSupport />}
        />

        {/* =================================================
            ADMIN DASHBOARD
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