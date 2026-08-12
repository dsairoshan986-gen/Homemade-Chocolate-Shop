import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FeaturedProducts.css";

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

import API_URL from "../../config/api";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductImage = (product) => {
    const name = (product.name || "").toLowerCase();

    if (name.includes("dark")) {
      return darkTruffle;
    }

    if (name.includes("milk")) {
      return milkChocolate;
    }

    if (name.includes("white")) {
      return whiteChocolate;
    }

    if (
      name.includes("ferrero") ||
      name.includes("hazelnut")
    ) {
      return ferrero;
    }

    return darkTruffle;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/products`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch products"
        );
      }

      setProducts((result.data || []).slice(0, 4));
    } catch (err) {
      console.error(
        "Featured Products Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load featured products."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="featured-section">
      <div className="featured-container">

        {/* Heading */}

        <div className="featured-heading">

          <span className="featured-tag">
            ⭐ Customer Favorites
          </span>

          <h2>
            Our Featured Chocolates
          </h2>

          <p>
            Discover some of our most loved
            handcrafted chocolates.
          </p>

        </div>


        {/* Loading */}

        {loading && (
          <div className="featured-loading">

            <div className="featured-spinner"></div>

            <p>
              Loading delicious chocolates...
            </p>

          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="featured-error">

            <span>⚠️</span>

            <p>{error}</p>

            <button onClick={fetchProducts}>
              Try Again
            </button>

          </div>
        )}


        {/* Empty */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="featured-empty">

              <span>🍫</span>

              <h3>
                No products available
              </h3>

              <p>
                Check back soon for delicious
                chocolates.
              </p>

            </div>
          )}


        {/* Products */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="featured-grid">

              {products.map((product) => {

                const price =
                  Number(product.price) || 0;

                const image =
                  getProductImage(product);

                return (
                  <div
                    className="featured-card"
                    key={product.id}
                  >

                    {/* Product Image */}

                    <Link
                      to={`/products/${product.id}`}
                      className="featured-image-link"
                    >

                      <div className="featured-image-wrapper">

                        <img
                          src={image}
                          alt={
                            product.name ||
                            "Chocolate"
                          }
                          className="featured-image"
                        />

                        <span className="featured-badge">
                          ⭐ Featured
                        </span>

                      </div>

                    </Link>


                    {/* Product Details */}

                    <div className="featured-content">

                      <h3>
                        {product.name}
                      </h3>

                      <p className="featured-description">
                        {product.description ||
                          "Delicious handcrafted chocolate made with premium ingredients."}
                      </p>


                      <div className="featured-bottom">

                        <span className="featured-price">
                          ₹{price.toFixed(2)}
                        </span>

                        <Link
                          to={`/products/${product.id}`}
                          className="featured-button"
                        >
                          View Product →
                        </Link>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}


        {/* View All */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="featured-view-all">

              <Link
                to="/products"
                className="view-all-button"
              >
                View All Chocolates →
              </Link>

            </div>
          )}

      </div>
    </section>
  );
}

export default FeaturedProducts;