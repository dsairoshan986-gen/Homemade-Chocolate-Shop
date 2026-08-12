import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

import API_URL from "../../config/api";

// =====================================================
// PRODUCT IMAGE MAP
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
  if (!product) {
    return darkTruffle;
  }

  // Uploaded backend image
  if (
    product.image_url &&
    product.image_url.startsWith("/uploads/")
  ) {
    return `http://localhost:5000${product.image_url}`;
  }

  // Database filename
  if (product.image_url) {
    const filename =
      product.image_url.split("/").pop();

    if (imageMap[filename]) {
      return imageMap[filename];
    }
  }

  // Product name mapping
  if (imageMap[product.name]) {
    return imageMap[product.name];
  }

  return darkTruffle;
};

// =====================================================
// PRODUCT DETAILS
// =====================================================

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  // ===================================================
  // STATE
  // ===================================================

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  const [added, setAdded] = useState(false);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [wishlistMessage, setWishlistMessage] =
    useState("");

  // ===================================================
  // FETCH PRODUCT
  // ===================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          );
        }

        const result =
          await response.json();

        console.log(
          "PRODUCT DETAILS RESPONSE:",
          result
        );

        if (result.success) {
          setProduct(result.data);

          // -------------------------------------------
          // CHECK WISHLIST
          // -------------------------------------------

          const savedWishlist =
            localStorage.getItem(
              "wishlist"
            );

          if (savedWishlist) {
            try {
              const wishlist =
                JSON.parse(
                  savedWishlist
                );

              if (
                Array.isArray(wishlist)
              ) {
                const exists =
                  wishlist.some(
                    (wishlistId) =>
                      Number(wishlistId) ===
                      Number(result.data.id)
                  );

                setIsWishlisted(exists);
              }
            } catch (error) {
              console.error(
                "Wishlist parse error:",
                error
              );
            }
          }
        } else {
          console.error(
            "Product not found:",
            result.message
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ===================================================
  // ADD TO CART
  // ===================================================

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (Number(product.stock) <= 0) {
      return;
    }

    addToCart(product, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  // ===================================================
  // ADD / REMOVE WISHLIST
  // ===================================================

  const handleWishlist = () => {
    // -----------------------------------------------
    // LOGIN CHECK
    // -----------------------------------------------

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");

      return;
    }

    if (!product) {
      return;
    }

    // -----------------------------------------------
    // GET CURRENT WISHLIST
    // -----------------------------------------------

    const savedWishlist =
      localStorage.getItem(
        "wishlist"
      );

    let wishlist = [];

    try {
      wishlist = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];
    } catch (error) {
      console.error(
        "Invalid wishlist data:",
        error
      );

      wishlist = [];
    }

    // Make sure it is an array
    if (!Array.isArray(wishlist)) {
      wishlist = [];
    }

    // -----------------------------------------------
    // CHECK IF ALREADY EXISTS
    // -----------------------------------------------

    const productId =
      Number(product.id);

    const exists =
      wishlist.some(
        (wishlistId) =>
          Number(wishlistId) ===
          productId
      );

    // -----------------------------------------------
    // REMOVE
    // -----------------------------------------------

    if (exists) {
      wishlist = wishlist.filter(
        (wishlistId) =>
          Number(wishlistId) !==
          productId
      );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );

      setIsWishlisted(false);

      setWishlistMessage(
        "Removed from wishlist"
      );
    }

    // -----------------------------------------------
    // ADD
    // -----------------------------------------------

    else {
      wishlist.push(productId);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );

      setIsWishlisted(true);

      setWishlistMessage(
        "Added to wishlist ❤️"
      );
    }

    // -----------------------------------------------
    // NOTIFY OTHER COMPONENTS
    // -----------------------------------------------

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );

    // -----------------------------------------------
    // CLEAR MESSAGE
    // -----------------------------------------------

    setTimeout(() => {
      setWishlistMessage("");
    }, 2000);
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fffaf2]">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 rounded-full border-4 border-[#efd6bc] border-t-[#b84d00] animate-spin" />

          <h2 className="mt-5 text-2xl font-semibold text-amber-900">
            Loading product...
          </h2>

        </div>

      </main>
    );
  }

  // ===================================================
  // PRODUCT NOT FOUND
  // ===================================================

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fffaf2]">

        <div className="text-center">

          <div className="text-6xl">
            🍫
          </div>

          <h2 className="mt-5 text-3xl font-bold text-red-600">
            Product not found
          </h2>

          <button
            onClick={() =>
              navigate("/products")
            }
            className="mt-6 bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Products
          </button>

        </div>

      </main>
    );
  }

  // ===================================================
  // IMAGE
  // ===================================================

  const image =
    getProductImage(product);

  // ===================================================
  // UI
  // ===================================================

  return (
    <section className="min-h-screen bg-[#fffaf2] py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* ============================================
            BACK BUTTON
        ============================================= */}

        <button
          onClick={() =>
            navigate("/products")
          }
          className="mb-8 text-amber-800 font-semibold hover:text-amber-600"
        >
          ← Back to Products
        </button>

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ==========================================
              PRODUCT IMAGE
          =========================================== */}

          <div className="relative">

            <img
              src={image}
              alt={product.name}
              className="w-full h-[450px] object-cover rounded-2xl shadow-xl"
              onError={(event) => {
                event.currentTarget.src =
                  darkTruffle;
              }}
            />

            {/* WISHLIST BUTTON */}

            <button
              type="button"
              onClick={handleWishlist}
              title={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="absolute top-5 right-5 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl hover:scale-110 transition"
            >
              {isWishlisted
                ? "❤️"
                : "🤍"}
            </button>

          </div>

          {/* ==========================================
              PRODUCT INFORMATION
          =========================================== */}

          <div>

            <p className="text-amber-700 font-semibold uppercase tracking-wide">
              Premium Handmade Chocolate
            </p>

            <h1 className="text-5xl font-bold text-amber-900 mt-3">
              {product.name}
            </h1>

            <p className="text-gray-600 text-lg mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* PRICE */}

            <p className="text-4xl font-bold text-red-600 mt-6">
              ₹ {Number(product.price).toFixed(2)}
            </p>

            {/* STOCK */}

            <p className="text-gray-700 mt-4">
              Stock available:{" "}
              <span className="font-bold">
                {product.stock}
              </span>
            </p>

            {/* ========================================
                WISHLIST MESSAGE
            ========================================= */}

            {wishlistMessage && (
              <div className="mt-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 font-semibold">
                {wishlistMessage}
              </div>
            )}

            {/* ========================================
                QUANTITY
            ========================================= */}

            <div className="flex items-center gap-4 mt-8">

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (q) =>
                      Math.max(
                        1,
                        q - 1
                      )
                  )
                }
                className="w-10 h-10 rounded-lg bg-amber-200 text-amber-900 text-xl hover:bg-amber-300"
              >
                -
              </button>

              <span className="text-xl font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (q) =>
                      Math.min(
                        Number(
                          product.stock
                        ),
                        q + 1
                      )
                  )
                }
                disabled={
                  Number(
                    product.stock
                  ) <= 0
                }
                className="w-10 h-10 rounded-lg bg-amber-200 text-amber-900 text-xl hover:bg-amber-300 disabled:opacity-50"
              >
                +
              </button>

            </div>

            {/* ========================================
                ADD TO CART
            ========================================= */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                Number(product.stock) <= 0
              }
              className="mt-8 w-full bg-amber-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-amber-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {Number(product.stock) <= 0
                ? "Out of Stock"
                : added
                ? "✓ Added to Cart"
                : "🛒 Add to Cart"}
            </button>

            {/* ========================================
                WISHLIST BUTTON
            ========================================= */}

            <button
              type="button"
              onClick={handleWishlist}
              className={`mt-4 w-full py-4 rounded-xl text-lg font-semibold border-2 transition ${
                isWishlisted
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-amber-700 bg-white text-amber-800 hover:bg-amber-50"
              }`}
            >
              {isWishlisted
                ? "❤️ Remove from Wishlist"
                : "🤍 Add to Wishlist"}
            </button>

            {/* ========================================
                VIEW WISHLIST
            ========================================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/wishlist")
              }
              className="mt-4 w-full text-amber-800 font-semibold hover:text-amber-600"
            >
              View My Wishlist →
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductDetails;