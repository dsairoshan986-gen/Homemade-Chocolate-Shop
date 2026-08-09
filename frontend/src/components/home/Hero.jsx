import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-container">

        {/* Left Content */}

        <div className="hero-content">

          <span className="hero-tag">
            🍫 Handmade With Love
          </span>

          <h1>
            Delicious Chocolate,
            <br />
            Made Just For You
          </h1>

          <p>
            Discover handcrafted chocolates made with premium
            ingredients, rich flavors, and lots of love.
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="hero-primary-button"
            >
              Shop Chocolates
            </Link>

            <Link
              to="/about"
              className="hero-secondary-button"
            >
              Our Story
            </Link>

          </div>

          <div className="hero-features">

            <div>
              <strong>100%</strong>
              <span>Homemade</span>
            </div>

            <div>
              <strong>Premium</strong>
              <span>Ingredients</span>
            </div>

            <div>
              <strong>Fresh</strong>
              <span>Every Day</span>
            </div>

          </div>

        </div>


        {/* Right Image */}

        <div className="hero-image-container">

          <div className="hero-circle"></div>

          <img
            src="/images/dark-truffle.jpg"
            alt="Handmade chocolate truffles"
            className="hero-image"
          />

          <div className="hero-floating-card">

            <span className="floating-icon">
              ⭐
            </span>

            <div>
              <strong>Made With Love</strong>
              <small>Premium Homemade Chocolate</small>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;