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
// AUTH
// =====================================================

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// =====================================================
// ACCOUNT
// =====================================================

import Profile from "./pages/Profile/Profile";
import Wishlist from "./pages/Wishlist/Wishlist";

// =====================================================
// CONTACT
// =====================================================

import ContactSupport from "./pages/ContactSupport/ContactSupport";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProducts from "./pages/Admin/AdminProducts";

// =====================================================
// 404
// =====================================================

import NotFound from "./pages/NotFound/NotFound";


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    return null;
  }
}


// =====================================================
// CHECK ADMIN
// =====================================================

function isAdminUser(user) {
  if (!user) {
    return false;
  }

  const role = String(
    user.role ||
      user.accountType ||
      user.userType ||
      ""
  ).toLowerCase();

  return (
    role === "admin" ||
    role === "administrator"
  );
}


// =====================================================
// CUSTOMER PROTECTED ROUTE
// =====================================================

function ProtectedCustomerRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin should use admin pages
  if (isAdminUser(user)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}


// =====================================================
// ADMIN PROTECTED ROUTE
// =====================================================

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = getCurrentUser();

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Not admin
  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <>
      {/* =================================================
          GLOBAL NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          APPLICATION ROUTES
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


        {/* =================================================
            ORDER SUCCESS WITH ID
        ================================================= */}

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
            CONTACT US
            Available before and after login
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
          GLOBAL FOOTER
      ================================================= */}

      <Footer />

    </>
  );
}

export default App;