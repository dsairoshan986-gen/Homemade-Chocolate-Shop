import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../../config/api";

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

// =====================================================
// DEFAULT PRODUCT IMAGE MAP
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

  // Existing uploaded product image
  if (
    product.image_url &&
    product.image_url.startsWith("/uploads/")
  ) {
    return `http://localhost:5000${product.image_url}`;
  }

  // Existing database filename
  if (product.image_url) {
    if (imageMap[product.image_url]) {
      return imageMap[product.image_url];
    }

    const filename =
      product.image_url.split("/").pop();

    if (imageMap[filename]) {
      return imageMap[filename];
    }
  }

  // Product-name mapping
  if (imageMap[product.name]) {
    return imageMap[product.name];
  }

  return darkTruffle;
};

// =====================================================
// WISHLIST PAGE
// =====================================================

function Wishlist() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const savedWishlist =
      localStorage.getItem("wishlist");

    if (savedWishlist) {
      try {
        const parsed =
          JSON.parse(savedWishlist);

        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      } catch (err) {
        console.error(
          "Failed to load wishlist:",
          err
        );
      }
    }

    fetchProducts();
  }, [navigate]);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/products`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}`
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to load products."
        );
      }

      setProducts(result.data || []);

    } catch (err) {
      console.error(
        "Wishlist products error:",
        err
      );

      setError(
        "Unable to load your wishlist."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeFromWishlist = (productId) => {
    const updatedWishlist =
      wishlistIds.filter(
        (id) => Number(id) !== Number(productId)
      );

    setWishlistIds(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // =====================================================
  // CLEAR WISHLIST
  // =====================================================

  const clearWishlist = () => {
    setWishlistIds([]);

    localStorage.setItem(
      "wishlist",
      JSON.stringify([])
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {
    const existingCart =
      localStorage.getItem("cart");

    let cart = [];

    try {
      cart = existingCart
        ? JSON.parse(existingCart)
        : [];
    } catch (error) {
      cart = [];
    }

    const existingItemIndex =
      cart.findIndex(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert(
      `${product.name} added to cart.`
    );
  };

  // =====================================================
  // FILTER WISHLIST PRODUCTS
  // =====================================================

  const wishlistProducts =
    products.filter((product) =>
      wishlistIds.some(
        (id) =>
          Number(id) === Number(product.id)
      )
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8ef] flex items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-12 w-12 rounded-full border-4 border-[#efd6bc] border-t-[#b84d00] animate-spin" />

          <p className="mt-5 text-xl font-semibold text-[#6b2e0b]">
            Loading your wishlist...
          </p>

        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-[#fff8ef] flex items-center justify-center px-6">

        <div className="text-center">

          <div className="text-6xl">
            😕
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#6b2e0b]">
            Something went wrong
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="mt-6 bg-[#b84d00] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#963f00]"
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (wishlistProducts.length === 0) {
    return (
      <main className="min-h-screen bg-[#fff8ef] px-6 py-16">

        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm">
            <span>❤️</span>

            <span className="font-semibold text-[#8a3d0c]">
              My Wishlist
            </span>
          </div>

          <div className="mt-16">

            <div className="text-8xl">
              🤎
            </div>

            <h1 className="mt-6 text-4xl font-extrabold text-[#6b2e0b]">
              Your Wishlist is Empty
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              Save your favorite chocolates here
              and come back to them later.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 bg-[#b84d00] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#963f00] transition"
            >
              Browse Chocolates
            </Link>

          </div>

        </div>

      </main>
    );
  }

  // =====================================================
  // WISHLIST UI
  // =====================================================

  return (
    <main className="min-h-screen bg-[#fff8ef] px-6 py-12">

      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

          <div>

            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm">
              <span>❤️</span>

              <span className="font-semibold text-[#8a3d0c]">
                Saved For Later
              </span>
            </div>

            <h1 className="mt-5 text-5xl font-extrabold text-[#6b2e0b]">
              My Wishlist
            </h1>

            <p className="mt-3 text-gray-600">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1
                ? "product"
                : "products"}{" "}
              saved
            </p>

          </div>

          {/* CLEAR */}

          <button
            onClick={clearWishlist}
            className="self-start md:self-auto rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 hover:bg-red-50 transition"
          >
            Clear Wishlist
          </button>

        </div>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {wishlistProducts.map((product) => {

            const image =
              getProductImage(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#f0dfce] hover:shadow-2xl transition"
              >

                {/* IMAGE */}

                <div className="relative">

                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    onError={(event) => {
                      event.currentTarget.src =
                        darkTruffle;
                    }}
                  />

                  {/* REMOVE BUTTON */}

                  <button
                    onClick={() =>
                      removeFromWishlist(
                        product.id
                      )
                    }
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-xl hover:bg-red-50 transition"
                  >
                    ❤️
                  </button>

                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <h2 className="text-xl font-bold text-[#6b2e0b]">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mt-2 min-h-[50px]">
                    {product.description}
                  </p>

                  <p className="text-2xl font-bold text-red-600 mt-4">
                    ₹ {Number(product.price).toFixed(2)}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    Stock: {product.stock}
                  </p>

                  {/* ACTIONS */}

                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                    disabled={
                      Number(product.stock) <= 0
                    }
                    className="w-full mt-5 bg-[#b84d00] text-white py-3 rounded-xl font-semibold hover:bg-[#963f00] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {Number(product.stock) > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>

                  <Link
                    to={`/products/${product.id}`}
                    className="block text-center mt-3 border border-[#b84d00] text-[#b84d00] py-3 rounded-xl font-semibold hover:bg-[#fff0df] transition"
                  >
                    View Product
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}

export default Wishlist;