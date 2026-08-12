import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminProducts.css";

// =====================================================
// EXISTING PRODUCT IMAGES
// =====================================================

import darkTruffleImage from "../../assets/images/products/dark-truffle.jpg";
import ferreroImage from "../../assets/images/products/ferrero.jpg";
import milkChocolateImage from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolateImage from "../../assets/images/products/white-chocolate.jpg";

// =====================================================
// API URL
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// =====================================================
// EXISTING IMAGE HELPER
// =====================================================

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  const image = String(imageUrl).trim();

  const imageMap = {
    "/images/dark-truffle.jpg": darkTruffleImage,
    "/images/milk-chocolate.jpg": milkChocolateImage,
    "/images/white-chocolate.jpg": whiteChocolateImage,
    "/images/ferrero.jpg": ferreroImage,

    "dark-truffle.jpg": darkTruffleImage,
    "milk-chocolate.jpg": milkChocolateImage,
    "white-chocolate.jpg": whiteChocolateImage,
    "ferrero.jpg": ferreroImage,
  };

  if (imageMap[image]) {
    return imageMap[image];
  }

  // Uploaded backend image
  if (image.startsWith("/uploads/")) {
    return `http://localhost:5000${image}`;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("data:image")) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/${image}`;
};

// =====================================================
// ADMIN PRODUCTS
// =====================================================

function AdminProducts() {
  const navigate = useNavigate();

  // ===================================================
  // PRODUCTS
  // ===================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===================================================
  // FORM
  // ===================================================

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    featured: false,
  });

  // ===================================================
  // IMAGE UPLOAD STATE
  // ===================================================

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  // ===================================================
  // CHECK ADMIN ACCESS
  // ===================================================

  const checkAdminAccess = useCallback(() => {
    const token = localStorage.getItem("token");

    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error(
        "User JSON parse error:",
        error
      );
    }

    if (!token || !user) {
      navigate("/login");
      return false;
    }

    if (user.role !== "admin") {
      navigate("/");
      return false;
    }

    return true;
  }, [navigate]);

  // ===================================================
  // FETCH PRODUCTS
  // ===================================================

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!checkAdminAccess()) {
        return;
      }

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/products?t=${Date.now()}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },

          cache: "no-store",
        }
      );

      const result = await response.json();

      console.log(
        "ADMIN PRODUCTS RESPONSE:",
        result
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch products"
        );
      }

      let productsData = [];

      if (Array.isArray(result)) {
        productsData = result;
      } else if (Array.isArray(result.data)) {
        productsData = result.data;
      } else if (Array.isArray(result.products)) {
        productsData = result.products;
      } else if (
        result.data &&
        Array.isArray(result.data.products)
      ) {
        productsData =
          result.data.products;
      }

      setProducts(productsData);
    } catch (error) {
      console.error(
        "Fetch Products Error:",
        error
      );

      setError(
        error.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }, [checkAdminAccess, navigate]);

  // ===================================================
  // LOAD PRODUCTS
  // ===================================================

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ===================================================
  // HANDLE TEXT INPUT
  // ===================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ===================================================
  // HANDLE IMAGE SELECTION
  // ===================================================

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // -----------------------------------------------
    // FILE TYPE VALIDATION
    // -----------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";

      return;
    }

    // -----------------------------------------------
    // FILE SIZE VALIDATION
    // -----------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image must be smaller than 5 MB."
      );

      event.target.value = "";

      return;
    }

    // -----------------------------------------------
    // CLEAR ERROR
    // -----------------------------------------------

    setError("");

    // -----------------------------------------------
    // SAVE FILE
    // -----------------------------------------------

    setSelectedImage(file);

    // -----------------------------------------------
    // CREATE PREVIEW
    // -----------------------------------------------

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      featured: false,
    });

    setSelectedImage(null);

    setImagePreview("");

    setEditingProduct(null);

    setShowForm(false);
  };

  // ===================================================
  // ADD PRODUCT
  // ===================================================

  const handleAddProduct = () => {
    if (!checkAdminAccess()) {
      return;
    }

    resetForm();

    setShowForm(true);

    setError("");
  };

  // ===================================================
  // EDIT PRODUCT
  // ===================================================

  const handleEditProduct = (product) => {
    if (!checkAdminAccess()) {
      return;
    }

    setEditingProduct(product);

    setFormData({
      name: product.name || "",

      description:
        product.description || "",

      price: product.price ?? "",

      stock: product.stock ?? "",

      category:
        product.category || "",

      featured:
        Boolean(product.featured),
    });

    // Existing image preview
    const existingImage =
      product.image_url ||
      product.image ||
      "";

    if (existingImage) {
      setImagePreview(
        getImageUrl(existingImage)
      );
    } else {
      setImagePreview("");
    }

    // New image is not selected yet
    setSelectedImage(null);

    setShowForm(true);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // SUBMIT PRODUCT
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!checkAdminAccess()) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      const token =
        localStorage.getItem("token");

      const isEditing =
        editingProduct !== null;

      const productId =
        editingProduct?.id ||
        editingProduct?.product_id;

      const url = isEditing
        ? `${API_URL}/products/${productId}`
        : `${API_URL}/products`;

      const method = isEditing
        ? "PUT"
        : "POST";

      // =================================================
      // FORM DATA
      // =================================================

      const formDataToSend =
        new FormData();

      formDataToSend.append(
        "name",
        formData.name
      );

      formDataToSend.append(
        "description",
        formData.description
      );

      formDataToSend.append(
        "price",
        formData.price
      );

      formDataToSend.append(
        "stock",
        formData.stock
      );

      formDataToSend.append(
        "category",
        formData.category
      );

      formDataToSend.append(
        "featured",
        String(formData.featured)
      );

      // =================================================
      // ADD IMAGE
      // =================================================

      if (selectedImage) {
        formDataToSend.append(
          "image",
          selectedImage
        );
      }

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        url,
        {
          method,

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formDataToSend,
        }
      );

      const result =
        await response.json();

      console.log(
        "SAVE PRODUCT RESPONSE:",
        result
      );

      // =================================================
      // AUTH ERROR
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save product"
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.error(
        "Save Product Error:",
        error
      );

      setError(
        error.message ||
          "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE PRODUCT
  // ===================================================

  const handleDeleteProduct =
    async (product) => {
      if (!checkAdminAccess()) {
        return;
      }

      const productId =
        product.id ||
        product.product_id;

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${product.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(productId);

        setError("");

        const token =
          localStorage.getItem("token");

        const response =
          await fetch(
            `${API_URL}/products/${productId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const result =
          await response.json();

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to delete product"
          );
        }

        setProducts(
          (previousProducts) =>
            previousProducts.filter(
              (item) =>
                String(
                  item.id ||
                    item.product_id
                ) !==
                String(productId)
            )
        );
      } catch (error) {
        console.error(
          "Delete Product Error:",
          error
        );

        setError(
          error.message ||
            "Failed to delete product"
        );
      } finally {
        setDeletingId(null);
      }
    };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <section className="admin-products-page">

        <div className="admin-products-container">

          <div className="admin-products-loading">

            <div className="admin-products-spinner"></div>

            <p>
              Loading products...
            </p>

          </div>

        </div>

      </section>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <section className="admin-products-page">

      <div className="admin-products-container">

        {/* =============================================
            BACK TO DASHBOARD
        ============================================== */}

        <div className="admin-products-top">

          <Link
            to="/admin/dashboard"
            className="admin-back-link"
          >
            ← Back to Dashboard
          </Link>

        </div>

        {/* =============================================
            HEADER
        ============================================== */}

        <div className="admin-products-header">

          <div>

            <p className="admin-products-label">
              ADMINISTRATION
            </p>

            <h1>
              Manage Products
            </h1>

            <p className="admin-products-subtitle">
              Add, edit and remove chocolates
              from your store.
            </p>

          </div>

          <button
            type="button"
            className="add-product-button"
            onClick={handleAddProduct}
          >
            + Add Product
          </button>

        </div>

        {/* =============================================
            ERROR
        ============================================== */}

        {error && (
          <div className="admin-products-error">

            <span>
              ⚠️
            </span>

            <div>

              <strong>
                Error
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                fetchProducts();
              }}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =============================================
            ADD / EDIT FORM
        ============================================== */}

        {showForm && (
          <div className="product-form-card">

            <div className="product-form-header">

              <div>

                <p className="section-label">
                  {editingProduct
                    ? "EDIT PRODUCT"
                    : "NEW PRODUCT"}
                </p>

                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

              </div>

              <button
                type="button"
                className="close-form-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >

              {/* =======================================
                  PRODUCT NAME
              ======================================== */}

              <div className="form-group">

                <label htmlFor="name">
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />

              </div>

              {/* =======================================
                  DESCRIPTION
              ======================================== */}

              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                />

              </div>

              {/* =======================================
                  PRICE + STOCK
              ======================================== */}

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="price">
                    Price (₹)
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="299"
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="stock">
                    Stock
                  </label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="50"
                    required
                  />

                </div>

              </div>

              {/* =======================================
                  CATEGORY
              ======================================== */}

              <div className="form-group">

                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Chocolate"
                  required
                />

              </div>

              {/* =======================================
                  CHOOSE PRODUCT IMAGE
              ======================================== */}

              <div className="form-group">

                <label htmlFor="product-image">
                  Product Image
                </label>

                <input
                  id="product-image"
                  name="image"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <small>
                  JPG, JPEG, PNG or WEBP.
                  Maximum 5 MB.
                </small>

              </div>

              {/* =======================================
                  IMAGE PREVIEW
              ======================================== */}

              {imagePreview && (
                <div className="product-image-preview">

                  <p>
                    Image Preview
                  </p>

                  <img
                    src={imagePreview}
                    alt="Selected product"
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      display: "block",
                    }}
                  />

                  {selectedImage && (
                    <p>
                      Selected:
                      {" "}
                      {selectedImage.name}
                    </p>
                  )}

                </div>
              )}

              {/* =======================================
                  FEATURED
              ======================================== */}

              <div className="form-checkbox">

                <label>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Featured Product
                  </span>

                </label>

              </div>

              {/* =======================================
                  FORM BUTTONS
              ======================================== */}

              <div className="product-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-button"
                  disabled={saving}
                >
                  {saving
                    ? "Uploading..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =============================================
            PRODUCT COUNT
        ============================================== */}

        <div className="products-count-section">

          <div>

            <p>
              All Products
            </p>

            <span>
              {products.length}{" "}
              {products.length === 1
                ? "Product"
                : "Products"}
            </span>

          </div>

        </div>

        {/* =============================================
            NO PRODUCTS
        ============================================== */}

        {!error &&
          products.length === 0 && (
            <div className="no-products">

              <div className="no-products-icon">
                🍫
              </div>

              <h2>
                No Products Found
              </h2>

              <p>
                Add your first chocolate
                product to the store.
              </p>

              <button
                type="button"
                onClick={handleAddProduct}
                className="add-product-button"
              >
                + Add Product
              </button>

            </div>
          )}

        {/* =============================================
            PRODUCTS TABLE
        ============================================== */}

        {products.length > 0 && (
          <div className="products-table-wrapper">

            <table className="products-table">

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Featured
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map(
                  (product) => {
                    const productId =
                      product.id ||
                      product.product_id;

                    const imageValue =
                      product.image_url ||
                      product.image ||
                      "";

                    const imageUrl =
                      getImageUrl(
                        imageValue
                      );

                    return (
                      <tr
                        key={productId}
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="product-info">

                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={
                                  product.name ||
                                  "Chocolate product"
                                }
                                className="product-image"
                                onError={(
                                  event
                                ) => {
                                  console.error(
                                    "Product image failed:",
                                    imageUrl
                                  );

                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="product-image-placeholder">
                                🍫
                              </div>
                            )}

                            <div>

                              <strong>
                                {product.name}
                              </strong>

                              <p>
                                {product.description
                                  ? product.description.substring(
                                      0,
                                      80
                                    )
                                  : "No description available"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>
                          {product.category ||
                            "Chocolate"}
                        </td>

                        {/* PRICE */}

                        <td>

                          <strong>
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits:
                                  2,
                                maximumFractionDigits:
                                  2,
                              }
                            )}
                          </strong>

                        </td>

                        {/* STOCK */}

                        <td>

                          <span
                            className={`stock-badge ${
                              Number(
                                product.stock ||
                                  0
                              ) <= 0
                                ? "out-of-stock"
                                : Number(
                                    product.stock ||
                                      0
                                  ) <= 10
                                ? "low-stock"
                                : "in-stock"
                            }`}
                          >
                            {product.stock ??
                              0}
                          </span>

                        </td>

                        {/* FEATURED */}

                        <td>

                          {product.featured ? (
                            <span className="featured-badge">
                              Yes
                            </span>
                          ) : (
                            <span className="not-featured-badge">
                              No
                            </span>
                          )}

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="product-actions">

                            <button
                              type="button"
                              className="edit-button"
                              onClick={() =>
                                handleEditProduct(
                                  product
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() =>
                                handleDeleteProduct(
                                  product
                                )
                              }
                              disabled={
                                deletingId ===
                                productId
                              }
                            >
                              {deletingId ===
                              productId
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </section>
  );
}

export default AdminProducts;