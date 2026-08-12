import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
const user = JSON.parse(
  localStorage.getItem("user") || "null"
);

if (!token || !user) {
  navigate("/login");
  return;
}

if (user.role !== "admin") {
  navigate("/");
  return;
}

      const response = await fetch(
        `${API_URL}/admin/orders?t=${Date.now()}`,
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

      console.log("ADMIN DASHBOARD API RESPONSE:", result);

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch admin orders"
        );
      }

      let ordersData = [];

      if (Array.isArray(result)) {
        ordersData = result;
      } else if (Array.isArray(result.data)) {
        ordersData = result.data;
      } else if (Array.isArray(result.orders)) {
        ordersData = result.orders;
      }

      setOrders(ordersData);
    } catch (err) {
      console.error("Admin Dashboard Error:", err);

      setError(
        err.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (total, order) =>
        total +
        Number(
          order.total_amount ||
            order.total ||
            0
        ),
      0
    );

  if (loading) {
    return (
      <section className="admin-dashboard-page">
        <div className="admin-dashboard-container">
          <div className="dashboard-loading">
            <div className="dashboard-spinner"></div>

            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-dashboard-page">
        <div className="admin-dashboard-container">
          <div className="dashboard-header">
            <div>
              <p className="dashboard-label">
                ADMIN PANEL
              </p>

              <h1>Admin Dashboard</h1>
            </div>
          </div>

          <div className="dashboard-error">
            <div className="dashboard-error-icon">
              ⚠️
            </div>

            <h2>Unable to load dashboard</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchOrders}
              className="dashboard-retry"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dashboard-page">
      <div className="admin-dashboard-container">

        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">
              ADMIN PANEL
            </p>

            <h1>Admin Dashboard</h1>

            <p className="dashboard-subtitle">
              Manage your homemade chocolate
              orders and track your business.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="dashboard-refresh"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="dashboard-main-stats">

          <div className="dashboard-stat-card revenue-card">
            <div className="stat-icon">₹</div>

            <div>
              <p>Total Revenue</p>

              <h2>
                ₹{" "}
                {totalRevenue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </h2>
            </div>
          </div>

          <div className="dashboard-stat-card orders-card">
            <div className="stat-icon">📦</div>

            <div>
              <p>Total Orders</p>

              <h2>{totalOrders}</h2>
            </div>
          </div>

        </div>

        <div className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <p className="section-label">
                ORDER OVERVIEW
              </p>

              <h2>Order Status</h2>
            </div>
          </div>

          <div className="dashboard-status-grid">

            <div className="status-card pending-card">
              <div className="status-card-icon">
                ⏳
              </div>

              <div>
                <p>Pending</p>
                <strong>{pendingOrders}</strong>
              </div>
            </div>

            <div className="status-card confirmed-card">
              <div className="status-card-icon">
                ✓
              </div>

              <div>
                <p>Confirmed</p>
                <strong>{confirmedOrders}</strong>
              </div>
            </div>

            <div className="status-card processing-card">
              <div className="status-card-icon">
                ⚙
              </div>

              <div>
                <p>Processing</p>
                <strong>{processingOrders}</strong>
              </div>
            </div>

            <div className="status-card shipped-card">
              <div className="status-card-icon">
                🚚
              </div>

              <div>
                <p>Shipped</p>
                <strong>{shippedOrders}</strong>
              </div>
            </div>

            <div className="status-card delivered-card">
              <div className="status-card-icon">
                ✓
              </div>

              <div>
                <p>Delivered</p>
                <strong>{deliveredOrders}</strong>
              </div>
            </div>

            <div className="status-card cancelled-card">
              <div className="status-card-icon">
                ✕
              </div>

              <div>
                <p>Cancelled</p>
                <strong>{cancelledOrders}</strong>
              </div>
            </div>

          </div>
        </div>

        <div className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <p className="section-label">
                QUICK ACTIONS
              </p>

              <h2>Manage Store</h2>
            </div>
          </div>

          <div className="quick-actions">

            <Link
              to="/admin/orders"
              className="quick-action"
            >
              <span>📦</span>

              <div>
                <strong>Manage Orders</strong>

                <p>
                  View and update customer
                  orders
                </p>
              </div>

              <b>→</b>
            </Link>

            <Link
              to="/admin/products"
              className="quick-action"
            >
              <span>🍫</span>

              <div>
                <strong>Manage Products</strong>

                <p>
                  Add, edit and remove
                  chocolate products
                </p>
              </div>

              <b>→</b>
            </Link>

            <Link
              to="/products"
              className="quick-action"
            >
              <span>🛍️</span>

              <div>
                <strong>View Store</strong>

                <p>
                  View your chocolate
                  products
                </p>
              </div>

              <b>→</b>
            </Link>

          </div>

        </div>

        <div className="dashboard-section">

          <div className="dashboard-section-header">

            <div>
              <p className="section-label">
                RECENT ACTIVITY
              </p>

              <h2>Recent Orders</h2>
            </div>

            <Link
              to="/admin/orders"
              className="view-all-link"
            >
              View All →
            </Link>

          </div>

          {orders.length === 0 ? (

            <div className="no-dashboard-orders">

              <div>📦</div>

              <p>No orders yet.</p>

            </div>

          ) : (

            <div className="recent-orders">

              {orders
                .slice(0, 5)
                .map((order) => {

                  const orderId =
                    order.id ||
                    order.order_id;

                  const orderCustomer =
                    order.customer_name ||
                    order.email ||
                    "Customer";

                  const orderTotal =
                    Number(
                      order.total_amount ||
                        order.total ||
                        0
                    );

                  const orderStatus =
                    order.status ||
                    "Pending";

                  return (
                    <div
                      key={orderId}
                      className="recent-order"
                    >

                      <div className="recent-order-info">

                        <strong>
                          Order #{orderId}
                        </strong>

                        <span>
                          {orderCustomer}
                        </span>

                      </div>

                      <div className="recent-order-total">

                        ₹{" "}
                        {orderTotal.toFixed(2)}

                      </div>

                      <div
                        className={`recent-order-status status-${String(
                          orderStatus
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {orderStatus}
                      </div>

                    </div>
                  );
                })}

            </div>

          )}

        </div>

      </div>
    </section>
  );
}

export default AdminDashboard;