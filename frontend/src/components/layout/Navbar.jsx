import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // GET LOGIN INFORMATION
  // =====================================================

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  const isLoggedIn = Boolean(token && userData);

  // =====================================================
  // GET USER / ROLE
  // =====================================================

  let user = null;

  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (error) {
      console.error("Invalid user data:", error);
    }
  }

  const role = String(
    user?.role ||
      user?.accountType ||
      user?.userType ||
      localStorage.getItem("role") ||
      ""
  ).toLowerCase();

  const isAdmin =
    role === "admin" ||
    role === "administrator";

  const isCustomer =
    isLoggedIn && !isAdmin;

  // =====================================================
  // ACTIVE LINK
  // =====================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isProductsActive = () => {
    return location.pathname.startsWith("/products");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });

    window.location.reload();
  };

  // =====================================================
  // NAVBAR LINK STYLE
  // =====================================================

  const linkClass = (active = false) => {
    return `
      font-semibold
      transition
      ${
        active
          ? "text-[#b84d00] border-b-2 border-[#b84d00] pb-2"
          : "text-[#4a1f0b] hover:text-[#b84d00]"
      }
    `;
  };

  // =====================================================
  // NAVBAR
  // =====================================================

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#ead8c6] shadow-sm">

      <nav className="max-w-7xl mx-auto px-6">

        <div className="min-h-20 flex items-center justify-between">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex items-center gap-3 flex-shrink-0"
          >
            <span className="text-3xl">
              🍫
            </span>

            <span className="text-2xl font-extrabold text-[#6b2e0b]">
              Chocolate Shop
            </span>
          </Link>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="flex items-center gap-8">

            {/* =================================================
                BEFORE LOGIN
            ================================================= */}

            {!isLoggedIn && (
              <>
                {/* HOME */}

                <Link
                  to="/"
                  className={linkClass(
                    isActive("/")
                  )}
                >
                  Home
                </Link>

                {/* ABOUT */}

                <Link
                  to="/about"
                  className={linkClass(
                    isActive("/about")
                  )}
                >
                  About
                </Link>

                {/* CONTACT US */}

                <Link
                  to="/contact-support"
                  className={linkClass(
                    isActive("/contact-support")
                  )}
                >
                  Contact Us
                </Link>

                {/* PRODUCTS */}

                <Link
                  to="/products"
                  className={linkClass(
                    isProductsActive()
                  )}
                >
                  Products
                </Link>

                {/* LOGIN */}

                <Link
                  to="/login"
                  className={linkClass(
                    isActive("/login")
                  )}
                >
                  Login
                </Link>
              </>
            )}

            {/* =================================================
                ADMIN
            ================================================= */}

            {isLoggedIn && isAdmin && (
              <>
                {/* DASHBOARD */}

                <Link
                  to="/admin/dashboard"
                  className={linkClass(
                    location.pathname.startsWith(
                      "/admin/dashboard"
                    )
                  )}
                >
                  Dashboard
                </Link>

                {/* PRODUCTS */}

                <Link
                  to="/admin/products"
                  className={linkClass(
                    location.pathname.startsWith(
                      "/admin/products"
                    )
                  )}
                >
                  Products
                </Link>

                {/* ORDERS */}

                <Link
                  to="/admin/orders"
                  className={linkClass(
                    location.pathname.startsWith(
                      "/admin/orders"
                    )
                  )}
                >
                  Orders
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    rounded-xl
                    bg-[#6b2e0b]
                    px-5
                    py-3
                    text-white
                    font-bold
                    transition
                    hover:bg-[#4a1f0b]
                  "
                >
                  Logout
                </button>
              </>
            )}

            {/* =================================================
                CUSTOMER AFTER LOGIN
            ================================================= */}

            {isCustomer && (
              <>
                {/* HOME */}

                <Link
                  to="/"
                  className={linkClass(
                    isActive("/")
                  )}
                >
                  Home
                </Link>

                {/* ABOUT */}

                <Link
                  to="/about"
                  className={linkClass(
                    isActive("/about")
                  )}
                >
                  About
                </Link>

                {/* CONTACT US */}

                <Link
                  to="/contact-support"
                  className={linkClass(
                    isActive("/contact-support")
                  )}
                >
                  Contact Us
                </Link>

                {/* PRODUCTS */}

                <Link
                  to="/products"
                  className={linkClass(
                    isProductsActive()
                  )}
                >
                  Products
                </Link>

                {/* CART */}

                <Link
                  to="/cart"
                  className={linkClass(
                    isActive("/cart")
                  )}
                >
                  🛒 Cart
                </Link>

                {/* MY ORDERS */}

                <Link
                  to="/orders"
                  className={linkClass(
                    isActive("/orders")
                  )}
                >
                  📦 My Orders
                </Link>

                {/* WISHLIST */}

                <Link
                  to="/wishlist"
                  className={linkClass(
                    isActive("/wishlist")
                  )}
                >
                  💗 Wishlist
                </Link>

                {/* PROFILE */}

                <Link
                  to="/profile"
                  className={linkClass(
                    isActive("/profile")
                  )}
                >
                  👤 Profile
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    rounded-xl
                    bg-[#6b2e0b]
                    px-5
                    py-3
                    text-white
                    font-bold
                    transition
                    hover:bg-[#4a1f0b]
                  "
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>

      </nav>

    </header>
  );
}

export default Navbar;