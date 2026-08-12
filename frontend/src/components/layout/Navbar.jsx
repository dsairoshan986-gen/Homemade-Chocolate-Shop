import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // AUTH STATE
  // =====================================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error("Failed to read user:", error);
      return null;
    }
  });

  // =====================================================
  // MOBILE MENU
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // LOGIN / REGISTER PAGE
  // =====================================================

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  const isAdmin =
    Boolean(token) &&
    Boolean(user) &&
    user.role === "admin";

  // =====================================================
  // UPDATE AUTH STATE
  // =====================================================

  useEffect(() => {
    const updateAuth = () => {
      const currentToken =
        localStorage.getItem("token");

      setToken(currentToken);

      try {
        const savedUser =
          localStorage.getItem("user");

        setUser(
          savedUser
            ? JSON.parse(savedUser)
            : null
        );
      } catch (error) {
        console.error(
          "Failed to read user:",
          error
        );

        setUser(null);
      }
    };

    updateAuth();

    window.addEventListener(
      "storage",
      updateAuth
    );

    window.addEventListener(
      "authChanged",
      updateAuth
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateAuth
      );

      window.removeEventListener(
        "authChanged",
        updateAuth
      );
    };
  }, [location.pathname]);

  // =====================================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // =====================================================

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setMenuOpen(false);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // NAV LINK STYLE
  // =====================================================

  const navLinkClass = ({ isActive }) =>
    `navbar-link ${
      isActive
        ? "navbar-link-active"
        : ""
    }`;

  // =====================================================
  // USER NAME
  // =====================================================

  const displayName =
    user?.name ||
    user?.username ||
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "User";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          <span className="navbar-logo-icon">
            🍫
          </span>

          <span>
            Chocolate Shop
          </span>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="navbar-desktop">

          {/* =================================================
              LOGIN / REGISTER
              ONLY ABOUT + CONTACT US
          ================================================= */}

          {isAuthPage ? (
            <>
              <NavLink
                to="/about"
                className={navLinkClass}
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={navLinkClass}
              >
                Contact Us
              </NavLink>
            </>

          ) : isAdmin ? (

            /* =================================================
                ADMIN NAVIGATION
                NO CONTACT US
            ================================================= */

            <>
              <NavLink
                to="/admin/dashboard"
                className={navLinkClass}
              >
                📊 Dashboard
              </NavLink>

              <NavLink
                to="/admin/products"
                className={navLinkClass}
              >
                🍫 Products
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={navLinkClass}
              >
                📦 Orders
              </NavLink>

              <NavLink
                to="/profile"
                className={navLinkClass}
              >
                👤 Profile
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="navbar-logout"
              >
                Logout
              </button>
            </>

          ) : (

            /* =================================================
                CUSTOMER NAVIGATION
            ================================================= */

            <>
              {/* HOME */}

              <NavLink
                to="/"
                className={navLinkClass}
              >
                Home
              </NavLink>

              {/* ABOUT */}

              <NavLink
                to="/about"
                className={navLinkClass}
              >
                About
              </NavLink>

              {/* CONTACT US */}

              <NavLink
                to="/contact"
                className={navLinkClass}
              >
                Contact Us
              </NavLink>

              {/* PRODUCTS */}

              <NavLink
                to="/products"
                className={navLinkClass}
              >
                Products
              </NavLink>

              {/* =================================================
                  LOGGED-IN CUSTOMER
              ================================================= */}

              {token && user ? (
                <>
                  {/* CART */}

                  <NavLink
                    to="/cart"
                    className={navLinkClass}
                  >
                    🛒 Cart
                  </NavLink>

                  {/* ORDERS */}

                  <NavLink
                    to="/orders"
                    className={navLinkClass}
                  >
                    📦 My Orders
                  </NavLink>

                  {/* WISHLIST */}

                  <NavLink
                    to="/wishlist"
                    className={navLinkClass}
                  >
                    ❤️ Wishlist
                  </NavLink>

                  {/* PROFILE */}

                  <NavLink
                    to="/profile"
                    className={navLinkClass}
                  >
                    👤 {displayName}
                  </NavLink>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="navbar-logout"
                  >
                    Logout
                  </button>
                </>

              ) : (

                /* =================================================
                    GUEST CUSTOMER
                ================================================= */

                <>
                  <NavLink
                    to="/login"
                    className={navLinkClass}
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    className="navbar-register"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </>
          )}

        </nav>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="navbar-mobile-button"
          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {menuOpen && (
        <div className="navbar-mobile">

          <nav className="navbar-mobile-links">

            {/* =================================================
                LOGIN / REGISTER
            ================================================= */}

            {isAuthPage ? (
              <>
                <NavLink
                  to="/about"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  About
                </NavLink>

                <NavLink
                  to="/contact"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Contact Us
                </NavLink>
              </>

            ) : isAdmin ? (

              /* =================================================
                  MOBILE ADMIN
                  NO CONTACT US
              ================================================= */

              <>
                <NavLink
                  to="/admin/dashboard"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  📊 Dashboard
                </NavLink>

                <NavLink
                  to="/admin/products"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  🍫 Products
                </NavLink>

                <NavLink
                  to="/admin/orders"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  📦 Orders
                </NavLink>

                <NavLink
                  to="/profile"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  👤 Profile
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="navbar-mobile-logout"
                >
                  Logout
                </button>
              </>

            ) : (

              /* =================================================
                  MOBILE CUSTOMER
              ================================================= */

              <>
                <NavLink
                  to="/"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/about"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  About
                </NavLink>

                <NavLink
                  to="/contact"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Contact Us
                </NavLink>

                <NavLink
                  to="/products"
                  className={navLinkClass}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Products
                </NavLink>

                {token && user ? (
                  <>
                    <NavLink
                      to="/cart"
                      className={navLinkClass}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      🛒 Cart
                    </NavLink>

                    <NavLink
                      to="/orders"
                      className={navLinkClass}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      📦 My Orders
                    </NavLink>

                    <NavLink
                      to="/wishlist"
                      className={navLinkClass}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      ❤️ Wishlist
                    </NavLink>

                    <NavLink
                      to="/profile"
                      className={navLinkClass}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      👤 {displayName}
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="navbar-mobile-logout"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={navLinkClass}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      className="navbar-register mobile-register"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </>
            )}

          </nav>

        </div>
      )}

    </header>
  );
}

export default Navbar;