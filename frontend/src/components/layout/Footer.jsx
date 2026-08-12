import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#4a1f0b] text-[#f8dfc5]">

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* =================================================
              BRAND
          ================================================= */}

          <div>

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <span className="text-3xl">
                🍫
              </span>

              <span className="text-2xl font-extrabold text-white">
                Chocolate Shop
              </span>

            </Link>

            <p className="mt-5 text-[#e8cbb3] leading-relaxed">
              Handcrafted chocolates made with premium
              ingredients, passion and lots of love.
            </p>

            {/* SOCIAL LINKS */}

            <div className="flex flex-wrap gap-3 mt-6">

              <a
                href="#"
                className="border border-[#8a5637] rounded-lg px-4 py-2 text-sm hover:bg-[#6b2e0b] hover:text-white transition"
              >
                Instagram
              </a>

              <a
                href="#"
                className="border border-[#8a5637] rounded-lg px-4 py-2 text-sm hover:bg-[#6b2e0b] hover:text-white transition"
              >
                Facebook
              </a>

              <a
                href="https://wa.me/919963781985"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#8a5637] rounded-lg px-4 py-2 text-sm hover:bg-[#6b2e0b] hover:text-white transition"
              >
                WhatsApp
              </a>

            </div>

          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div>

            <h3 className="text-xl font-bold text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/"
                  className="hover:text-white transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="hover:text-white transition"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="hover:text-white transition"
                >
                  My Orders
                </Link>
              </li>

            </ul>

          </div>

          {/* =================================================
              CUSTOMER SERVICE
          ================================================= */}

          <div>

            <h3 className="text-xl font-bold text-white">
              Customer Service
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to="/checkout"
                  className="hover:text-white transition"
                >
                  Checkout
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition"
                >
                  Register
                </Link>
              </li>

              {/* CONTACT SUPPORT */}

              <li>
                <Link
                  to="/contact-support"
                  className="hover:text-white transition"
                >
                  Contact Support
                </Link>
              </li>

            </ul>

          </div>

          {/* =================================================
              CONTACT US
          ================================================= */}

          <div>

            <h3 className="text-xl font-bold text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">

              {/* LOCATION */}

              <div className="flex items-start gap-3">

                <span className="text-lg">
                  📍
                </span>

                <span>
                  Ongole, Andhra Pradesh
                </span>

              </div>

              {/* PHONE */}

              <div className="flex items-start gap-3">

                <span className="text-lg">
                  📞
                </span>

                <a
                  href="tel:+919963781985"
                  className="hover:text-white transition"
                >
                  +91 9963781985
                </a>

              </div>

              {/* EMAIL */}

              <div className="flex items-start gap-3">

                <span className="text-lg">
                  ✉️
                </span>

                <a
                  href="mailto:d.sairoshan986@gmail.com"
                  className="hover:text-white transition break-all"
                >
                  d.sairoshan986@gmail.com
                </a>

              </div>

              {/* BUSINESS HOURS */}

              <div className="flex items-start gap-3">

                <span className="text-lg">
                  🕘
                </span>

                <span>
                  Mon - Sun: 9:00 AM - 7:00 PM
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM FOOTER
      ===================================================== */}

      <div className="border-t border-[#6b351b]">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-sm text-[#dcbda5] text-center md:text-left">
              © {new Date().getFullYear()} Chocolate Shop.
              All rights reserved.
            </p>

            <p className="text-sm text-[#dcbda5]">
              🍫 Handmade with love
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;