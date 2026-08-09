import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminProducts.css";

const API_URL = "http://localhost:5000/api";

function AdminProducts() {

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


  // ========================================
  // TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // ========================================
  // FETCH PRODUCTS
  // ========================================

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await fetch(
        `${API_URL}/products`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
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

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // FORM INPUT
  // ========================================

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


  // ========================================
  // RESET FORM
  // ========================================

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


  // ========================================
  // OPEN ADD FORM
  // ========================================

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

  };


  // ========================================
  // OPEN EDIT FORM
  // ========================================

  const handleEditProduct = (product) => {

    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image_url: product.image_url || "",
      stock: product.stock || "",
      featured: product.featured || false,
    });

    setMessage("");

    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // ========================================
  // ADD / UPDATE PRODUCT
  // ========================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");

    setError("");


    // Basic validation
    if (!formData.name.trim()) {

      setError(
        "Product name is required."
      );

      return;
    }

    if (!formData.price) {

      setError(
        "Product price is required."
      );

      return;
    }


    try {

      const token = getToken();

      if (!token) {

        setError(
          "You are not logged in. Please login again."
        );

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
            name: formData.name.trim(),

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


      if (!response.ok) {

        throw new Error(
          result.message ||
          `Failed to ${
            isEditing
              ? "update"
              : "create"
          } product`
        );
      }


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

      setError(err.message);

    }

  };


  // ========================================
  // DELETE PRODUCT
  // ========================================

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


    try {

      setMessage("");

      setError("");


      const token = getToken();


      if (!token) {

        setError(
          "You are not logged in. Please login again."
        );

        return;
      }


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


      if (!response.ok) {

        throw new Error(
          result.message ||
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

      setError(err.message);

    }

  };


  // ========================================
  // FORMAT PRICE
  // ========================================

  const formatPrice = (price) => {

    return Number(price || 0)
      .toLocaleString(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
        }
      );

  };


  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="admin-products-page">

      {/* ====================================
          HEADER
      ===================================== */}

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
          className="add-product-btn"
          onClick={handleAddProduct}
        >
          + Add Product
        </button>

      </div>


      {/* ====================================
          SUCCESS MESSAGE
      ===================================== */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}


      {/* ====================================
          ERROR MESSAGE
      ===================================== */}

      {error && (
        <div className="error-message">
          ✕ {error}
        </div>
      )}


      {/* ====================================
          PRODUCT FORM
      ===================================== */}

      {showForm && (
        <section className="product-form-section">

          <div className="form-header">

            <h2>
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <button
              type="button"
              className="close-form-btn"
              onClick={resetForm}
            >
              ✕
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
            className="product-form"
          >

            {/* Name */}
            <div className="form-group">

              <label htmlFor="name">
                Product Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dark Chocolate Truffles"
                required
              />

            </div>


            {/* Description */}
            <div className="form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your chocolate..."
                rows="4"
              />

            </div>


            <div className="form-row">

              {/* Price */}
              <div className="form-group">

                <label htmlFor="price">
                  Price (₹) *
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


              {/* Stock */}
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
                  placeholder="20"
                />

              </div>

            </div>


            <div className="form-row">

              {/* Category */}
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
                  placeholder="Dark Chocolate"
                />

              </div>


              {/* Image */}
              <div className="form-group">

                <label htmlFor="image_url">
                  Image URL
                </label>

                <input
                  id="image_url"
                  name="image_url"
                  type="text"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="/images/dark-truffle.jpg"
                />

              </div>

            </div>


            {/* Featured */}
            <div className="checkbox-group">

              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
              />

              <label htmlFor="featured">
                Show this product as featured
              </label>

            </div>


            {/* Buttons */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-product-btn"
              >
                {editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

            </div>

          </form>

        </section>
      )}


      {/* ====================================
          PRODUCTS
      ===================================== */}

      <section className="products-section">

        <div className="section-title">

          <h2>
            All Products
          </h2>

          <span>
            {products.length} Products
          </span>

        </div>


        {loading ? (

          <div className="loading">
            Loading products...
          </div>

        ) : products.length === 0 ? (

          <div className="empty-products">

            <div className="empty-icon">
              🍫
            </div>

            <h3>
              No products found
            </h3>

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

                      {/* Product */}
                      <td>

                        <div className="product-info">

                          {product.image_url ? (

                            <img
                              src={
                                product.image_url
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
                              {product.name}
                            </strong>

                            <p>
                              {product.description
                                ? product.description.substring(
                                    0,
                                    60
                                  )
                                : "No description"}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Category */}
                      <td>
                        {product.category ||
                          "—"}
                      </td>


                      {/* Price */}
                      <td>
                        <strong>
                          {formatPrice(
                            product.price
                          )}
                        </strong>
                      </td>


                      {/* Stock */}
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


                      {/* Featured */}
                      <td>

                        {product.featured ? (
                          <span className="featured-badge">
                            ⭐ Yes
                          </span>
                        ) : (
                          <span>
                            No
                          </span>
                        )}

                      </td>


                      {/* Actions */}
                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-btn"
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
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
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

      </section>

    </div>
  );
}


// ========================================
// IMPORTANT: DEFAULT EXPORT
// ========================================

export default AdminProducts;