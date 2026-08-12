import { Link } from "react-router-dom";

function Footer() {

  // =====================================================
  // LOGIN INFORMATION
  // =====================================================

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  const isLoggedIn = Boolean(
    token && userData
  );

  // =====================================================
  // USER INFORMATION
  // =====================================================

  let user = null;

  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );
    }
  }

  // =====================================================
  // ROLE
  // =====================================================

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
  // FOOTER
  // =====================================================

  return (
    <footer className="bg-[#5f250b] text-white mt-16">

      {/* =================================================
          NEWSLETTER
      ================================================= */}

      <div className="max-w-6xl mx-auto px-6 pt-12">

        <div className="
          bg-[#fffaf5]
          rounded-b-[32px]
          rounded-t-[32px]
          px-8
          py-8
          text-[#71300d]
          shadow-sm
        ">

          <div className="
            flex
            items-center
            gap-8
            flex-wrap
          ">

            {/* ICON */}

            <div className="
              w-28
              h-28
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              shadow-sm
              flex-shrink-0
            ">
              <span className="text-5xl">
                🍫
              </span>
            </div>

            {/* CONTENT */}

            <div className="flex-1 min-w-[280px]">

              <h2 className="
                text-3xl
                font-extrabold
                mb-2
              ">
                Get Sweet Updates
              </h2>

              <p className="
                text-[#315275]
                mb-5
              ">
                Subscribe to our newsletter for new
                chocolates, special offers and
                delicious updates.
              </p>

              <div className="
                flex
                gap-3
                flex-wrap
              ">

                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="
                    flex-1
                    min-w-[250px]
                    h-14
                    rounded-xl
                    border
                    border-[#decdbb]
                    bg-white
                    px-5
                    outline-none
                    text-[#3d2415]
                    focus:border-[#c65300]
                  "
                />

                <button
                  type="button"
                  className="
                    h-14
                    px-8
                    rounded-xl
                    bg-[#d35400]
                    text-white
                    font-bold
                    hover:bg-[#b94700]
                    transition
                  "
                >
                  Subscribe
                </button>

              </div>

              <p className="
                text-sm
                text-[#526b88]
                mt-2
              ">
                We respect your privacy. No spam.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          FOOTER MAIN CONTENT
      ================================================= */}

      <div className="
        max-w-6xl
        mx-auto
        px-6
        py-14
      ">

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-12
        ">

          {/* =================================================
              SHOP
          ================================================= */}

          <div>

            <div className="
              flex
              items-center
              gap-3
              mb-6
            ">

              <span className="text-3xl">
                🍫
              </span>

              <h3 className="
                text-2xl
                font-extrabold
              ">
                Chocolate Shop
              </h3>

            </div>

            <p className="
              text-white/90
              leading-7
              max-w-sm
            ">
              Handcrafted chocolates made with premium
              ingredients, passion and lots of love.
            </p>

            {/* SOCIAL BUTTONS */}

            <div className="
              flex
              gap-3
              mt-6
              flex-wrap
            ">

              <button
                type="button"
                className="
                  border
                  border-[#a95728]
                  rounded-lg
                  px-4
                  py-2
                  hover:bg-[#7b3210]
                  transition
                "
              >
                Instagram
              </button>

              <button
                type="button"
                className="
                  border
                  border-[#a95728]
                  rounded-lg
                  px-4
                  py-2
                  hover:bg-[#7b3210]
                  transition
                "
              >
                Facebook
              </button>

              <button
                type="button"
                className="
                  border
                  border-[#a95728]
                  rounded-lg
                  px-4
                  py-2
                  hover:bg-[#7b3210]
                  transition
                "
              >
                WhatsApp
              </button>

            </div>

          </div>

          {/* =================================================
              CUSTOMER SERVICE
          ================================================= */}

          <div>

            <h3 className="
              text-2xl
              font-extrabold
              mb-6
            ">
              Customer Service
            </h3>

            {/* ---------------------------------------------
                BEFORE LOGIN
            --------------------------------------------- */}

            {!isLoggedIn && (
              <div className="
                flex
                flex-col
                gap-4
              ">

                <Link
                  to="/"
                  className="hover:text-[#ffbd91] transition"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="hover:text-[#ffbd91] transition"
                >
                  About
                </Link>

                <Link
                  to="/products"
                  className="hover:text-[#ffbd91] transition"
                >
                  Products
                </Link>

                <Link
                  to="/contact-support"
                  className="hover:text-[#ffbd91] transition"
                >
                  Contact Support
                </Link>

              </div>
            )}

            {/* ---------------------------------------------
                ADMIN
            --------------------------------------------- */}

            {isLoggedIn && isAdmin && (
              <div className="
                flex
                flex-col
                gap-4
              ">

                <Link
                  to="/admin/dashboard"
                  className="hover:text-[#ffbd91] transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  className="hover:text-[#ffbd91] transition"
                >
                  Products
                </Link>

                <Link
                  to="/admin/orders"
                  className="hover:text-[#ffbd91] transition"
                >
                  Orders
                </Link>

                <Link
                  to="/contact-support"
                  className="hover:text-[#ffbd91] transition"
                >
                  Contact Support
                </Link>

              </div>
            )}

            {/* ---------------------------------------------
                CUSTOMER AFTER LOGIN
            --------------------------------------------- */}

            {isCustomer && (
              <div className="
                flex
                flex-col
                gap-4
              ">

                <Link
                  to="/cart"
                  className="hover:text-[#ffbd91] transition"
                >
                  Cart
                </Link>

                <Link
                  to="/orders"
                  className="hover:text-[#ffbd91] transition"
                >
                  My Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="hover:text-[#ffbd91] transition"
                >
                  Wishlist
                </Link>

                <Link
                  to="/profile"
                  className="hover:text-[#ffbd91] transition"
                >
                  Profile
                </Link>

                <Link
                  to="/contact-support"
                  className="hover:text-[#ffbd91] transition"
                >
                  Contact Support
                </Link>

              </div>
            )}

          </div>

          {/* =================================================
              CONTACT US
          ================================================= */}

          <div>

            <h3 className="
              text-2xl
              font-extrabold
              mb-6
            ">
              Contact Us
            </h3>

            <div className="
              flex
              flex-col
              gap-5
              text-white/90
            ">

              <div className="flex gap-3">
                <span>📍</span>
                <span>
                  Ongole, Andhra Pradesh
                </span>
              </div>

              <div className="flex gap-3">
                <span>📞</span>
                <span>
                  +91 9963781985
                </span>
              </div>

              <div className="flex gap-3">
                <span>✉️</span>
                <span>
                  d.sairoshan986@gmail.com
                </span>
              </div>

              <div className="flex gap-3">
                <span>🕘</span>
                <span>
                  Mon - Sun: 9:00 AM - 7:00 PM
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          COPYRIGHT
      ================================================= */}

      <div className="
        border-t
        border-[#8b421c]
      ">

        <div className="
          max-w-6xl
          mx-auto
          px-6
          py-5
          flex
          justify-between
          items-center
          flex-wrap
          gap-4
        ">

          <p className="text-white/90">
            © 2026 Chocolate Shop.
            All rights reserved.
          </p>

          <p className="text-white/90">
            🍫 Handmade with love
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;