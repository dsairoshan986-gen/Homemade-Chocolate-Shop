import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  // =========================================================
  // LOGIN CHECK
  // =========================================================

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const isLoggedIn = Boolean(token && user);

  // =========================================================
  // BACKEND URL
  // =========================================================

  const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

  // =========================================================
  // GET PRODUCT IMAGE
  // =========================================================

  const getImageUrl = (product) => {
    if (!product) {
      return null;
    }

    const image =
      product.image_url ||
      product.imageUrl ||
      product.image ||
      product.product_image ||
      product.productImage ||
      product.photo ||
      product.image_path ||
      product.imagePath;

    console.log("Product:", product);
    console.log("Image value:", image);

    if (!image) {
      return null;
    }

    const cleanImage = String(image).trim();

    // Base64 image
    if (cleanImage.startsWith("data:image")) {
      return cleanImage;
    }

    // Full URL
    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {
      return cleanImage;
    }

    // /uploads/...
    if (cleanImage.startsWith("/uploads/")) {
      return `${BACKEND_URL}${cleanImage}`;
    }

    // uploads/...
    if (cleanImage.startsWith("uploads/")) {
      return `${BACKEND_URL}/${cleanImage}`;
    }

    // /static/...
    if (cleanImage.startsWith("/static/")) {
      return `${BACKEND_URL}${cleanImage}`;
    }

    // static/...
    if (cleanImage.startsWith("static/")) {
      return `${BACKEND_URL}/${cleanImage}`;
    }

    // /images/...
    if (cleanImage.startsWith("/images/")) {
      return `${BACKEND_URL}${cleanImage}`;
    }

    // images/...
    if (cleanImage.startsWith("images/")) {
      return `${BACKEND_URL}/${cleanImage}`;
    }

    // /media/...
    if (cleanImage.startsWith("/media/")) {
      return `${BACKEND_URL}${cleanImage}`;
    }

    // media/...
    if (cleanImage.startsWith("media/")) {
      return `${BACKEND_URL}/${cleanImage}`;
    }

    // If only filename is stored
    return `${BACKEND_URL}/uploads/products/${cleanImage}`;
  };

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching products from:",
          `${API_URL}/products`
        );

        const response = await fetch(
          `${API_URL}/products`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products. Status: ${response.status}`
          );
        }

        const result = await response.json();

        console.log("Products API response:", result);

        let productList = [];

        // Backend returns array directly
        if (Array.isArray(result)) {
          productList = result;
        }

        // Backend returns { data: [...] }
        else if (Array.isArray(result.data)) {
          productList = result.data;
        }

        // Backend returns { products: [...] }
        else if (Array.isArray(result.products)) {
          productList = result.products;
        }

        // Backend returns { data: { products: [...] } }
        else if (
          result.data &&
          Array.isArray(result.data.products)
        ) {
          productList = result.data.products;
        }

        console.log(
          "Final product list:",
          productList
        );

        setProducts(productList);
      } catch (err) {
        console.error(
          "Error fetching products:",
          err
        );

        setError(
          "Unable to load products. Please make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================================
  // VIEW PRODUCT
  // =========================================================

  const handleViewProduct = (productId) => {
    // User is not logged in
    if (!isLoggedIn) {
      setShowLoginMessage(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // User is logged in
    navigate(`/products/${productId}`);
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8ef] flex items-center justify-center">
        <div className="text-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-[#efd8c0]
              border-t-[#c65300]
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p
            className="
              mt-5
              text-lg
              font-semibold
              text-[#6b2e0b]
            "
          >
            Loading products...
          </p>

        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error) {
    return (
      <div
        className="
          min-h-screen
          bg-[#fff8ef]
          flex
          items-center
          justify-center
          px-6
        "
      >
        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-10
            text-center
            max-w-lg
            w-full
          "
        >
          <div className="text-5xl">
            🍫
          </div>

          <h2
            className="
              mt-4
              text-2xl
              font-bold
              text-[#6b2e0b]
            "
          >
            Unable to Load Products
          </h2>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="
              mt-6
              bg-[#c65300]
              text-white
              px-6
              py-3
              rounded-xl
              font-bold
              hover:bg-[#a94300]
              transition
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#fff8ef]">

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="px-6 py-10">

        <div className="max-w-7xl mx-auto">

          {/* =================================================
              LOGIN / REGISTER MESSAGE
          ================================================= */}

          {showLoginMessage && !isLoggedIn && (
            <div
              className="
                mb-10
                bg-[#fff1df]
                border
                border-[#e7bd99]
                rounded-2xl
                p-6
                text-center
                shadow-sm
              "
            >

              <div className="text-4xl">
                🔐
              </div>

              <h2
                className="
                  mt-3
                  text-2xl
                  font-extrabold
                  text-[#6b2e0b]
                "
              >
                Please Login or Register First
              </h2>

              <p
                className="
                  mt-2
                  text-[#31506f]
                "
              >
                Please login or register first to
                view the product details.
              </p>

              <div
                className="
                  mt-5
                  flex
                  justify-center
                  gap-4
                  flex-wrap
                "
              >

                <Link
                  to="/login"
                  className="
                    bg-[#c65300]
                    text-white
                    px-8
                    py-3
                    rounded-xl
                    font-bold
                    hover:bg-[#a94300]
                    transition
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    bg-white
                    text-[#8a3d0c]
                    border-2
                    border-[#c65300]
                    px-8
                    py-3
                    rounded-xl
                    font-bold
                    hover:bg-[#fff7ed]
                    transition
                  "
                >
                  Register
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setShowLoginMessage(false)
                  }
                  className="
                    bg-white
                    text-gray-700
                    border
                    border-gray-300
                    px-8
                    py-3
                    rounded-xl
                    font-semibold
                    hover:bg-gray-50
                    transition
                  "
                >
                  Close
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <h1
            className="
              text-center
              text-5xl
              font-extrabold
              text-[#7b320b]
              mb-12
            "
          >
            Our Chocolates
          </h1>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          {products.length === 0 ? (

            <div
              className="
                text-center
                py-20
              "
            >
              <div className="text-6xl">
                🍫
              </div>

              <h2
                className="
                  mt-4
                  text-2xl
                  font-bold
                  text-[#7b320b]
                "
              >
                No Products Available
              </h2>
            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-8
              "
            >

              {products.map((product) => {

                const productId =
                  product.id ??
                  product._id;

                const name =
                  product.name ||
                  product.product_name ||
                  product.productName ||
                  "Chocolate";

                const description =
                  product.description ||
                  product.product_description ||
                  "Delicious handmade chocolate.";

                const price =
                  Number(product.price) || 0;

                const imageUrl =
                  getImageUrl(product);

                return (

                  <div
                    key={productId}
                    className="
                      bg-white
                      rounded-2xl
                      overflow-hidden
                      shadow-md
                      hover:shadow-xl
                      transition-all
                      duration-300
                      border
                      border-[#eadbc9]
                    "
                  >

                    {/* =========================================
                        PRODUCT IMAGE
                    ========================================= */}

                    <div
                      className="
                        relative
                        w-full
                        h-64
                        bg-[#f4e2ce]
                        overflow-hidden
                      "
                    >

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={name}
                          className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                          "
                          onLoad={() => {
                            console.log(
                              "IMAGE LOADED:",
                              imageUrl
                            );
                          }}
                          onError={(event) => {
                            console.error(
                              "IMAGE FAILED:",
                              imageUrl
                            );

                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event.currentTarget.parentElement.querySelector(
                                ".image-fallback"
                              );

                            if (fallback) {
                              fallback.style.display =
                                "flex";
                            }
                          }}
                        />

                      ) : null}

                      {/* FALLBACK IMAGE */}

                      <div
                        className="
                          image-fallback
                          absolute
                          inset-0
                          items-center
                          justify-center
                          flex-col
                          text-center
                        "
                        style={{
                          display: imageUrl
                            ? "none"
                            : "flex",
                        }}
                      >

                        <div className="text-7xl">
                          🍫
                        </div>

                        <p
                          className="
                            mt-2
                            text-[#7b320b]
                            font-semibold
                          "
                        >
                          Chocolate
                        </p>

                      </div>

                    </div>

                    {/* =========================================
                        PRODUCT DETAILS
                    ========================================= */}

                    <div className="p-5">

                      <h2
                        className="
                          text-xl
                          font-extrabold
                          text-[#7b320b]
                        "
                      >
                        {name}
                      </h2>

                      <p
                        className="
                          mt-3
                          text-[#31506f]
                          leading-relaxed
                          min-h-[55px]
                        "
                      >
                        {description}
                      </p>

                      {/* PRICE */}

                      <div
                        className="
                          mt-5
                          text-2xl
                          font-extrabold
                          text-red-600
                        "
                      >
                        ₹{price.toFixed(2)}
                      </div>

                      {/* VIEW PRODUCT */}

                      <button
                        type="button"
                        onClick={() =>
                          handleViewProduct(productId)
                        }
                        className="
                          mt-5
                          w-full
                          bg-[#c65300]
                          text-white
                          py-3
                          rounded-xl
                          font-bold
                          hover:bg-[#a94300]
                          transition
                        "
                      >
                        View Product
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Products;