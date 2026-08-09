import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            🍫 Chocolate Shop
          </Link>

          <p>
            Handcrafted chocolates made with premium
            ingredients, passion and lots of love.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>

            <a href="#" aria-label="WhatsApp">
              WhatsApp
            </a>
          </div>

        </div>


        {/* Quick Links */}

        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/orders">
            My Orders
          </Link>

        </div>


        {/* Customer Service */}

        <div className="footer-column">

          <h3>
            Customer Service
          </h3>

          <Link to="/checkout">
            Checkout
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

          <a href="mailto:support@chocolateshop.com">
            Contact Support
          </a>

        </div>


        {/* Contact */}

        <div className="footer-column footer-contact">

          <h3>
            Contact Us
          </h3>

          <p>
            📍 Ongole, Andhra Pradesh
          </p>

          <p>
            📞 +91 9963781985
          </p>

          <p>
            ✉️ d.sairoshan986@gmail.com
          </p>

          <p>
            🕐 Mon - Sun: 9:00 AM - 7:00 PM
          </p>

        </div>

      </div>


      {/* Bottom */}

      <div className="footer-bottom">

        <div>
          © {currentYear} Chocolate Shop.
          All rights reserved.
        </div>

        <div className="footer-bottom-links">
          <span>
            Privacy Policy
          </span>

          <span>
            Terms & Conditions
          </span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;