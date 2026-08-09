import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get products
      const productsResponse = await fetch(
        `${API_URL}/products`
      );

      const productsResult = await productsResponse.json();

      if (productsResult.success) {
        setProducts(productsResult.data || []);
      } else if (Array.isArray(productsResult)) {
        setProducts(productsResult);
      }

      // Get orders
      const ordersResponse = await fetch(
        `${API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ordersResult = await ordersResponse.json();

      if (ordersResult.success) {
        setOrders(ordersResult.data || []);
      }

      // Customers
      // If you don't have a customer API yet, we calculate
      // unique customers from the orders.
      if (ordersResult.success) {
        const uniqueCustomers = new Set(
          (ordersResult.data || []).map(
            (order) => order.email
          )
        );

        setCustomers(Array.from(uniqueCustomers));
      }
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce(
    (total, order) => {
      return (
        total +
        Number(order.total_amount || 0)
      );
    },
    0
  );

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <section className="admin-header">

        <div>
          <span className="admin-badge">
            🍫 Administration
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Manage your chocolate shop from one place.
          </p>
        </div>

        <Link
          to="/"
          className="view-store-btn"
        >
          View Store →
        </Link>

      </section>


      {/* Statistics */}
      <section className="admin-stats">

        {/* Products */}
        <div className="stat-card">

          <div className="stat-icon">
            🍫
          </div>

          <div>
            <span className="stat-title">
              Total Products
            </span>

            <strong>
              {loading ? "..." : products.length}
            </strong>
          </div>

        </div>


        {/* Orders */}
        <div className="stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>
            <span className="stat-title">
              Total Orders
            </span>

            <strong>
              {loading ? "..." : orders.length}
            </strong>
          </div>

        </div>


        {/* Customers */}
        <div className="stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>
            <span className="stat-title">
              Customers
            </span>

            <strong>
              {loading ? "..." : customers.length}
            </strong>
          </div>

        </div>


        {/* Revenue */}
        <div className="stat-card">

          <div className="stat-icon">
            💰
          </div>

          <div>
            <span className="stat-title">
              Revenue
            </span>

            <strong>
              ₹{loading
                ? "..."
                : totalRevenue.toFixed(2)}
            </strong>
          </div>

        </div>

      </section>


      {/* Management */}
      <section className="management-section">

        <h2>Management</h2>

        <div className="management-grid">

          {/* Products */}
          <Link
            to="/admin/products"
            className="management-card"
          >

            <div className="management-icon">
              🍫
            </div>

            <div className="management-content">
              <h3>
                Manage Products
              </h3>

              <p>
                Add, edit and remove chocolates.
              </p>
            </div>

            <span className="management-arrow">
              →
            </span>

          </Link>


          {/* Orders */}
          <Link
            to="/admin/orders"
            className="management-card"
          >

            <div className="management-icon">
              📦
            </div>

            <div className="management-content">
              <h3>
                Manage Orders
              </h3>

              <p>
                View and update customer orders.
              </p>
            </div>

            <span className="management-arrow">
              →
            </span>

          </Link>

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;