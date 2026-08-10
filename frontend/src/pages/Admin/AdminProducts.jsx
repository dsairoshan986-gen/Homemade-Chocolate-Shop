import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminProducts.css";

// =====================================================
// PRODUCT IMAGES
// =====================================================

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

// =====================================================
// API
// =====================================================

const API_URL = "http://localhost:5000/api";

// =====================================================
// COMPONENT
// =====================================================

function AdminProducts() {
  // ===================================================
  // STATE
  // ===================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

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

  // ===================================================
  // GET TOKEN
  // ===================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ===================================================
  // GET PRODUCT IMAGE
  // ===================================================

  const getProductImage = (imageUrl, productName) => {
    const image = String(imageUrl || "").toLowerCase();

    const name = String(productName || "").toLowerCase();

    // Dark chocolate
    if (
      image.includes("dark-truffle") ||
      image.includes("dark_chocolate") ||
      image.includes("dark chocolate") ||
      name.includes("dark chocolate")
    ) {
      return darkTruffle;
    }

    // Milk chocolate
    if (
      image.includes("milk-chocolate") ||
      image.includes("milk_chocolate") ||
      image.includes("milk chocolate") ||
      name.includes("milk chocolate")
    ) {
      return milkChocolate;
    }

    // White chocolate
    if (
      image.includes("white-chocolate") ||
      image.includes("white_chocolate") ||
      image.includes("white chocolate") ||
      name.includes("white chocolate")
    ) {
      return whiteChocolate;
    }

    // Ferrero
    if (
      image.includes("ferrero") ||
      name.includes("ferrero")
    ) {
      return ferrero;
    }

    return null;
  };

  // ===================================================
  // FETCH PRODUCTS ON PAGE LOAD
  // ===================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===================================================
  // FETCH PRODUCTS
  // ===================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/products`
      );

      const result = await response.json();

      console.log(
        "ADMIN PRODUCTS API RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to fetch products"
        );
      }

      if (result.success) {
        setProducts(result.data || []);
      } else if (Array.isArray(result)) {
        setProducts(result);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(
        "Fetch Products Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // HANDLE FORM INPUT
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
  // RESET FORM
  // ===================================================

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

  // ===================================================
  // ADD PRODUCT
  // ===================================================

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

  // ===================================================
  // EDIT PRODUCT
  // ===================================================

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",

      description:
        product.description || "",

      price: product.price || "",

      category:
        product.category || "",

      image_url:
        product.image_url || "",

      stock:
        product.stock ?? "",

      featured:
        Boolean(product.featured),
    });

    setMessage("");
    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // ADD / UPDATE PRODUCT
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!formData.name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) <= 0
    ) {
      setError(
        "Product price must be greater than 0."
      );
      return;
    }

    if (
      formData.stock !== "" &&
      Number(formData.stock) < 0
    ) {
      setError(
        "Stock cannot be negative."
      );
      return;
    }

    // -------------------------------------------------
    // TOKEN
    // -------------------------------------------------

    const token = getToken();

    if (!token) {
      setError(
        "You are not logged in. Please login again."
      );
      return;
    }

    try {
      const isEditing =
        editingProduct !== null;

      const url = isEditing
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;

      const method = isEditing
        ? "PUT"
        : "POST";

      // -------------------------------------------------
      // REQUEST
      // -------------------------------------------------

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name:
              formData.name.trim(),

            description:
              formData.description.trim(),

            price:
              Number(formData.price),

            category:
              formData.category.trim(),

            image_url:
              formData.image_url.trim(),

            stock:
              Number(formData.stock || 0),

            featured:
              Boolean(formData.featured),
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "SAVE PRODUCT RESPONSE:",
        result
      );

      // -------------------------------------------------
      // ERROR
      // -------------------------------------------------

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

      // -------------------------------------------------
      // SUCCESS MESSAGE
      // -------------------------------------------------

      setMessage(
        isEditing
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      // -------------------------------------------------
      // RESET
      // -------------------------------------------------

      resetForm();

      // -------------------------------------------------
      // REFRESH
      // -------------------------------------------------

      await fetchProducts();
    } catch (err) {
      console.error(
        "Save Product Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save product."
      );
    }
  };

  // ===================================================
  // DELETE PRODUCT
  // ===================================================

  const handleDeleteProduct = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const token = getToken();

    if (!token) {
      setError(
        "You are not logged in. Please login again."
      );
      return;
    }

    try {
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

      console.log(
        "DELETE PRODUCT RESPONSE:",
        result
      );

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
        err.message ||
          "Failed to delete product."
      );
    }
  };

  // ===================================================
  // FORMAT PRICE
  // ===================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
      }
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="admin-products-page">
        <div className="admin-products-header">
          <div>
            <Link
              to="/admin"
              className="back-link"
            >
              ← Back to Dashboard
            </Link>

            <h1>Manage Products</h1>

            <p>
              Loading products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="admin-products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-products-header">

        <div>

          <Link
            to="/admin"
            className="back-link"
          >
            ← Back to Dashboard
          </Link>

          <h1>
            Manage Products
          </h1>

          <p>
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
        <div className="success-message">
          {message}
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}

      {showForm && (
        <div className="product-form-card">

          <div className="form-header">

            <h2>
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

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
                Product Name *
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
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
              />

            </div>

            {/* PRICE */}

            <div className="form-group">

              <label>
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={
                  formData.category
                }
                onChange={handleChange}
                placeholder="Example: Chocolate, Truffles, Gift"
              />

            </div>

            {/* IMAGE URL */}

            <div className="form-group">

              <label>
                Image Filename / URL
              </label>

              <input
                type="text"
                name="image_url"
                value={
                  formData.image_url
                }
                onChange={handleChange}
                placeholder="Example: dark-truffle.jpg"
              />

              <small>
                For existing products use:
                dark-truffle.jpg,
                milk-chocolate.jpg,
                white-chocolate.jpg
                or ferrero.jpg
              </small>

            </div>

            {/* STOCK */}

            <div className="form-group">

              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                min="0"
                step="1"
                required
              />

            </div>

            {/* FEATURED */}

            <div className="form-group checkbox-group">

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
          PRODUCT LIST
      ================================================= */}

      <div className="products-section">

        <div className="products-section-header">

          <div>
            <h2>
              All Products
            </h2>

            <p>
              {products.length} Products
            </p>
          </div>

        </div>

        {/* =================================================
            NO PRODUCTS
        ================================================= */}

        {products.length === 0 ? (
          <div className="no-products">

            <div className="no-products-icon">
              🍫
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Add your first chocolate
              product.
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
                  (product) => {

                    const productImage =
                      getProductImage(
                        product.image_url,
                        product.name
                      );

                    return (
                      <tr
                        key={
                          product.id
                        }
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="product-info">

                            {productImage ? (

                              <img
                                src={
                                  productImage
                                }
                                alt={
                                  product.name
                                }
                                className="product-image"
                              />

                            ) : (

                              <div className="product-placeholder">
                                🍫
                              </div>

                            )}

                            <div>

                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                              <p>
                                {
                                  product.description
                                    ? product.description.substring(
                                        0,
                                        80
                                      )
                                    : "No description"
                                }
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
                            {product.stock ??
                              0}
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
                    );
                  }
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