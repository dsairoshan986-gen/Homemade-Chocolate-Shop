import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminProducts.css";

const API_URL = "http://localhost:5000/api";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    stock: "",
    featured: false,
  });

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/products?t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      console.log("PRODUCTS API RESPONSE:", result);

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch products"
        );
      }

      if (result?.success && Array.isArray(result.data)) {
        setProducts(result.data);
      } else if (Array.isArray(result)) {
        setProducts(result);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch Products Error:", err);

      setError(
        err?.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

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

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      stock: "",
      featured: false,
    });

    setEditingProduct(null);
    setShowForm(false);
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      stock: "",
      featured: false,
    });

    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      image_url: product.image_url || "",
      stock: product.stock ?? "",
      featured: Boolean(product.featured),
    });

    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // ADD / UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setError("Please enter a valid product price.");
      return;
    }

    if (
      formData.stock !== "" &&
      Number(formData.stock) < 0
    ) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      const isEditing =
        editingProduct !== null;

      const url = isEditing
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: formData.name.trim(),

          description:
            formData.description.trim(),

          price: Number(formData.price),

          category:
            formData.category.trim(),

          image_url:
            formData.image_url.trim(),

          stock: Number(
            formData.stock || 0
          ),

          featured:
            Boolean(formData.featured),
        }),
      });

      const result = await response.json();

      console.log(
        "SAVE PRODUCT RESPONSE:",
        result
      );

      // ---------------------------------------------------
      // AUTH ERROR
      // ---------------------------------------------------

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // ---------------------------------------------------
      // API ERROR
      // ---------------------------------------------------

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Failed to ${
              isEditing
                ? "update"
                : "create"
            } product`
        );
      }

      // ---------------------------------------------------
      // SUCCESS
      // ---------------------------------------------------

      setMessage(
        isEditing
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();

      await fetchProducts();
    } catch (err) {
      console.error(
        "Save Product Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to save product"
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteProduct = async (
    productId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const token = getToken();

      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const result = await response.json();

      console.log(
        "DELETE PRODUCT RESPONSE:",
        result
      );

      // ---------------------------------------------------
      // AUTH ERROR
      // ---------------------------------------------------

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // ---------------------------------------------------
      // API ERROR
      // ---------------------------------------------------

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete product"
        );
      }

      setMessage(
        "Product deleted successfully!"
      );

      await fetchProducts();
    } catch (err) {
      console.error(
        "Delete Product Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete product"
      );
    }
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
      }
    );
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    // Already a complete URL
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    // Local frontend image names
    const imageName =
      imageUrl.split("/").pop();

    return `/src/assets/images/products/${imageName}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-products-page">

        <div className="admin-products-container">

          <div className="admin-products-loading">
            <div className="admin-products-spinner"></div>

            <p>
              Loading products...
            </p>
          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-products-page">

      <div className="admin-products-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-products-header">

          <div>

            {/* IMPORTANT:
                Use navigate() instead of Link
                for the dashboard button.
            */}

            <button
              type="button"
              onClick={() =>
                navigate("/admin/dashboard")
              }
              className="back-link"
            >
              ← Back to Dashboard
            </button>

            <p className="admin-products-label">
              🍫 ADMINISTRATION
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
            onClick={handleAddProduct}
            className="add-product-btn"
          >
            + Add Product
          </button>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="admin-products-success">
            {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="admin-products-error">

            <p>
              {error}
            </p>

          </div>
        )}

        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (
          <div className="product-form-card">

            <div className="product-form-header">

              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p>
                  Enter the chocolate product
                  information below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="close-form-btn"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="product-form"
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                />

              </div>

              {/* PRICE + CATEGORY */}

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="299"
                    min="0"
                    step="0.01"
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Chocolate"
                  />

                </div>

              </div>

              {/* IMAGE URL + STOCK */}

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="dark-truffle.jpg"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="50"
                    min="0"
                  />

                </div>

              </div>

              {/* FEATURED */}

              <div className="form-checkbox">

                <label>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />

                  <span>
                    Featured Product
                  </span>

                </label>

              </div>

              {/* BUTTONS */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="save-product-btn"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="cancel-product-btn"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =================================================
            PRODUCTS COUNT
        ================================================= */}

        <div className="products-summary">

          <div>
            All Products
          </div>

          <strong>
            {products.length} Products
          </strong>

        </div>

        {/* =================================================
            EMPTY PRODUCTS
        ================================================= */}

        {products.length === 0 ? (

          <div className="no-products">

            <div className="no-products-icon">
              🍫
            </div>

            <h2>
              No products found
            </h2>

            <p>
              Add your first chocolate product.
            </p>

            <button
              type="button"
              onClick={handleAddProduct}
              className="add-product-btn"
            >
              + Add Product
            </button>

          </div>

        ) : (

          /* =================================================
              PRODUCTS TABLE
          ================================================= */

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
                  (product) => (

                    <tr
                      key={product.id}
                    >

                      {/* PRODUCT */}

                      <td>

                        <div className="product-info">

                          {product.image_url ? (

                            <img
                              src={getImageUrl(
                                product.image_url
                              )}
                              alt={
                                product.name
                              }
                              className="product-image"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <div className="product-placeholder">
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
                                : "No description"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>
                        {product.category ||
                          "—"}
                      </td>

                      {/* PRICE */}

                      <td>

                        <strong>
                          {formatPrice(
                            product.price
                          )}
                        </strong>

                      </td>

                      {/* STOCK */}

                      <td>

                        <span
                          className={
                            Number(
                              product.stock
                            ) <= 5
                              ? "low-stock"
                              : "stock"
                          }
                        >
                          {product.stock ?? 0}
                        </span>

                      </td>

                      {/* FEATURED */}

                      <td>

                        {product.featured ? (

                          <span className="featured-badge">
                            Featured
                          </span>

                        ) : (

                          <span className="not-featured">
                            —
                          </span>

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="product-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditProduct(
                                product
                              )
                            }
                            className="edit-btn"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                            className="delete-btn"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminProducts;