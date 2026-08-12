import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

import API_URL from "../../config/api";

// =====================================================
// EXISTING PRODUCT IMAGE MAP
// =====================================================

const imageMap = {
  "Dark Chocolate Truffles": darkTruffle,
  "Milk Chocolate": milkChocolate,
  "White Chocolate": whiteChocolate,
  "Ferrero Chocolate": ferrero,
};

// =====================================================
// GET PRODUCT IMAGE
// =====================================================

const getProductImage = (product) => {
  // ---------------------------------------------------
  // Get image URL from database
  // ---------------------------------------------------

  const imageUrl =
    product.image_url ||
    product.image ||
    "";

  // ---------------------------------------------------
  // NEW UPLOADED IMAGE
  // ---------------------------------------------------
  //
  // Example:
  // /uploads/products/1786514342860-ferrero.jpg
  //
  // Convert it to:
  // http://localhost:5000/uploads/products/...
  //
  // ---------------------------------------------------

  if (
    imageUrl.startsWith("/uploads/")
  ) {
    return `${API_URL.replace(
      "/api",
      ""
    )}${imageUrl}`;
  }

  // ---------------------------------------------------
  // COMPLETE IMAGE URL
  // ---------------------------------------------------

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  // ---------------------------------------------------
  // OLD LOCAL PRODUCT IMAGES
  // ---------------------------------------------------

  if (imageMap[product.name]) {
    return imageMap[product.name];
  }

  // ---------------------------------------------------
  // OLD DATABASE IMAGE NAMES
  // ---------------------------------------------------

  if (
    imageUrl ===
    "dark-truffle.jpg"
  ) {
    return darkTruffle;
  }

  if (
    imageUrl ===
    "milk-chocolate.jpg"
  ) {
    return milkChocolate;
  }

  if (
    imageUrl ===
    "white-chocolate.jpg"
  ) {
    return whiteChocolate;
  }

  if (
    imageUrl ===
    "ferrero.jpg"
  ) {
    return ferrero;
  }

  // ---------------------------------------------------
  // EMPTY IMAGE
  // ---------------------------------------------------

  return "";
};

// =====================================================
// PRODUCTS PAGE
// =====================================================

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // FETCH PRODUCTS
  // ===================================================

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);

          setError("");

          const response =
            await fetch(
              `${API_URL}/products`
            );

          if (!response.ok) {
            throw new Error(
              `HTTP error: ${response.status}`
            );
          }

          const result =
            await response.json();

          console.log(
            "Products API response:",
            result
          );

          if (result.success) {
            setProducts(
              result.data || []
            );
          } else {
            setError(
              "Unable to load products."
            );
          }
        } catch (err) {
          console.error(
            "Failed to fetch products:",
            err
          );

          setError(
            "Failed to connect to the backend."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, []);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <h2 className="text-2xl text-amber-800">
          Loading products...
        </h2>

      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl text-red-600 font-bold">
            {error}
          </h2>

          <p className="mt-3 text-gray-600">
            Make sure the backend is running
            on port 5000.
          </p>

        </div>

      </div>
    );
  }

  // ===================================================
  // PRODUCTS PAGE
  // ===================================================

  return (
    <section className="min-h-screen bg-[#fffaf0] py-12 px-6">

      <div className="max-w-7xl mx-auto">

        {/* =============================================
            PAGE TITLE
        ============================================== */}

        <h1 className="text-5xl font-bold text-amber-900 text-center mb-12">
          Our Chocolates
        </h1>

        {/* =============================================
            PRODUCTS GRID
        ============================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {products.map(
            (product) => {
              const image =
                getProductImage(
                  product
                );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                >

                  {/* ===================================
                      PRODUCT IMAGE
                  ==================================== */}

                  {image ? (

                    <img
                      src={image}
                      alt={
                        product.name
                      }
                      className="w-full h-64 object-cover"

                      onError={(
                        event
                      ) => {
                        console.error(
                          "Product image failed:",
                          image
                        );

                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="w-full h-64 flex items-center justify-center bg-amber-50">

                      <span className="text-6xl">
                        🍫
                      </span>

                    </div>

                  )}

                  {/* ===================================
                      PRODUCT INFORMATION
                  ==================================== */}

                  <div className="p-5">

                    <h2 className="text-xl font-bold text-amber-900">
                      {product.name}
                    </h2>

                    <p className="text-gray-600 mt-2 min-h-[50px]">
                      {product.description}
                    </p>

                    <p className="text-2xl font-bold text-red-600 mt-4">
                      ₹ {product.price}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      Stock:{" "}
                      {product.stock}
                    </p>

                    {/* =================================
                        VIEW PRODUCT
                    ================================== */}

                    <button
                      onClick={() =>
                        navigate(
                          `/products/${product.id}`
                        )
                      }
                      className="w-full mt-5 bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition"
                    >
                      View Product
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}

export default Products;