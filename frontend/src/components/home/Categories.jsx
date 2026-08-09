import React from "react";
import { Link } from "react-router-dom";
import "./Categories.css";

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

const categories = [
  {
    id: 1,
    name: "Dark Chocolate",
    description: "Rich, deep and intensely delicious",
    image: darkTruffle,
  },
  {
    id: 2,
    name: "Milk Chocolate",
    description: "Creamy, smooth and wonderfully sweet",
    image: milkChocolate,
  },
  {
    id: 3,
    name: "White Chocolate",
    description: "Smooth, creamy and irresistibly delicate",
    image: whiteChocolate,
  },
  {
    id: 4,
    name: "Special Chocolates",
    description: "Perfect chocolates for every occasion",
    image: ferrero,
  },
];

function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-container">

        {/* Section Heading */}
        <div className="section-heading">

          <span className="section-tag">
            🍫 Our Collection
          </span>

          <h2>
            Choose Your Favorite Chocolate
          </h2>

          <p>
            Explore our delicious collection of handcrafted
            chocolates made with premium ingredients.
          </p>

        </div>

        {/* Category Cards */}
        <div className="categories-grid">

          {categories.map((category) => (
            <Link
              to="/products"
              className="category-card"
              key={category.id}
            >

              {/* Image */}
              <div className="category-image-wrapper">

                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                />

                <div className="category-overlay">
                  View Chocolates →
                </div>

              </div>

              {/* Content */}
              <div className="category-content">

                <h3>
                  {category.name}
                </h3>

                <p>
                  {category.description}
                </p>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Categories;