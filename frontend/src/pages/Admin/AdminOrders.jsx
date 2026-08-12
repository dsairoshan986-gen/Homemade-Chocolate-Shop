import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // =====================================================
  // CHECK ADMIN AUTHORIZATION
  // =====================================================

  const checkAdminAccess = () => {
    const token = localStorage.getItem("token");

    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error(
        "Failed to parse user data:",
        error
      );
    }

    // No token or user
    if (!token || !user) {
      navigate("/login");
      return false;
    }

    // User is not admin
    if (user.role !== "admin") {
      navigate("/");
      return false;
    }

    return true;
  };

  // =====================================================
  // FETCH ALL ADMIN ORDERS
  // =====================================================

  const fetchOrders = useCallback(async () => {
    try {
      setError("");

      // Check authentication before API request
      if (!checkAdminAccess()) {
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");

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

      let result = {};

      try {
        result = await response.json();
      } catch (error) {
        console.error(
          "Failed to parse API response:",
          error
        );
      }

      console.log(
        "ADMIN ORDERS API RESPONSE:",
        result
      );

      // =================================================
      // AUTHENTICATION ERROR
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch admin orders"
        );
      }

      // =================================================
      // EXTRACT ORDERS
      // =================================================

      let ordersData = [];

      if (Array.isArray(result)) {
        ordersData = result;
      } else if (
        Array.isArray(result.data)
      ) {
        ordersData = result.data;
      } else if (
        Array.isArray(result.orders)
      ) {
        ordersData = result.orders;
      } else if (
        result.data &&
        Array.isArray(result.data.orders)
      ) {
        ordersData = result.data.orders;
      }

      setOrders(ordersData);
    } catch (error) {
      console.error(
        "Admin Orders Error:",
        error
      );

      setError(
        error.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =====================================================
  // INITIAL LOAD + AUTOMATIC REFRESH
  // =====================================================

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchOrders]);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    if (!orderId || !newStatus) {
      return;
    }

    try {
      if (!checkAdminAccess()) {
        return;
      }

      setUpdatingOrderId(orderId);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      let result = {};

      try {
        result = await response.json();
      } catch (error) {
        console.error(
          "Failed to parse status update response:",
          error
        );
      }

      console.log(
        "UPDATE ORDER STATUS RESPONSE:",
        result
      );

      // =================================================
      // AUTH ERROR
      // =================================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update order status"
        );
      }

      // =================================================
      // UPDATE LOCAL ORDER
      // =================================================

      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          const currentId =
            order.id ||
            order.order_id;

          if (
            String(currentId) ===
            String(orderId)
          ) {
            return {
              ...order,
              status: newStatus,
            };
          }

          return order;
        })
      );
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      setError(
        error.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    try {
      return new Date(
        dateValue
      ).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // =====================================================
  // GET ORDER TOTAL
  // =====================================================

  const getOrderTotal = (order) => {
    return Number(
      order.total_amount ||
        order.total ||
        order.amount ||
        0
    );
  };

  // =====================================================
  // GET ORDER ID
  // =====================================================

  const getOrderId = (order) => {
    return (
      order.id ||
      order.order_id ||
      order.orderId
    );
  };

  // =====================================================
  // GET CUSTOMER NAME
  // =====================================================

  const getCustomerName = (order) => {
    return (
      order.customer_name ||
      order.customerName ||
      order.name ||
      order.user_name ||
      "Customer"
    );
  };

  // =====================================================
  // GET CUSTOMER EMAIL
  // =====================================================

  const getCustomerEmail = (order) => {
    return (
      order.email ||
      order.customer_email ||
      order.customerEmail ||
      "No email"
    );
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading && orders.length === 0) {
    return (
      <section className="admin-orders-page">
        <div className="admin-orders-container">

          <div className="admin-orders-loading">
            <div className="admin-orders-spinner"></div>

            <p>
              Loading customer orders...
            </p>
          </div>

        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <section className="admin-orders-page">

      <div className="admin-orders-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-orders-header">

          <div>

            <Link
              to="/admin/dashboard"
              className="admin-back-link"
            >
              ← Back to Dashboard
            </Link>

            <p className="admin-orders-label">
              ADMINISTRATION
            </p>

            <h1>
              Manage Orders
            </h1>

            <p className="admin-orders-subtitle">
              View customer orders and update
              their status.
            </p>

          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="admin-orders-error">

            <div>
              ⚠️
            </div>

            <div>
              <strong>
                Unable to load orders
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            ORDER COUNT
        ================================================= */}

        <div className="admin-orders-summary">

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

        </div>

        {/* =================================================
            NO ORDERS
        ================================================= */}

        {!error &&
          orders.length === 0 && (
            <div className="admin-no-orders">

              <div className="admin-no-orders-icon">
                📦
              </div>

              <h2>
                No Orders Yet
              </h2>

              <p>
                Customer orders will appear
                here when they place an order.
              </p>

            </div>
          )}

        {/* =================================================
            ORDERS LIST
        ================================================= */}

        {orders.length > 0 && (
          <div className="admin-orders-list">

            {orders.map((order) => {
              const orderId =
                getOrderId(order);

              const status =
                order.status ||
                "Pending";

              const total =
                getOrderTotal(order);

              return (
                <div
                  key={orderId}
                  className="admin-order-card"
                >

                  {/* =========================================
                      ORDER HEADER
                  ========================================= */}

                  <div className="admin-order-card-header">

                    <div>

                      <p className="admin-order-label">
                        ORDER
                      </p>

                      <h2>
                        #
                        {orderId}
                      </h2>

                    </div>

                    <span
                      className={`admin-order-status status-${String(
                        status
                      )
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )}`}
                    >
                      {status}
                    </span>

                  </div>

                  {/* =========================================
                      CUSTOMER INFORMATION
                  ========================================= */}

                  <div className="admin-order-details">

                    <div className="admin-order-detail">

                      <span>
                        Customer
                      </span>

                      <strong>
                        {getCustomerName(
                          order
                        )}
                      </strong>

                    </div>

                    <div className="admin-order-detail">

                      <span>
                        Email
                      </span>

                      <strong>
                        {getCustomerEmail(
                          order
                        )}
                      </strong>

                    </div>

                    <div className="admin-order-detail">

                      <span>
                        Order Date
                      </span>

                      <strong>
                        {formatDate(
                          order.created_at ||
                            order.createdAt ||
                            order.order_date ||
                            order.orderDate
                        )}
                      </strong>

                    </div>

                    <div className="admin-order-detail">

                      <span>
                        Total
                      </span>

                      <strong className="admin-order-price">
                        ₹
                        {total.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* =========================================
                      SHIPPING INFORMATION
                  ========================================= */}

                  {(order.address ||
                    order.shipping_address ||
                    order.phone) && (
                    <div className="admin-shipping-info">

                      <h3>
                        Customer Details
                      </h3>

                      {order.phone && (
                        <p>
                          <strong>
                            Phone:
                          </strong>{" "}
                          {order.phone}
                        </p>
                      )}

                      {(order.address ||
                        order.shipping_address) && (
                        <p>
                          <strong>
                            Address:
                          </strong>{" "}
                          {order.address ||
                            order.shipping_address}
                        </p>
                      )}

                    </div>
                  )}

                  {/* =========================================
                      STATUS UPDATE
                  ========================================= */}

                  <div className="admin-order-actions">

                    <div>

                      <label
                        htmlFor={`status-${orderId}`}
                      >
                        Update Status
                      </label>

                      <select
                        id={`status-${orderId}`}
                        value={status}
                        disabled={
                          updatingOrderId ===
                          orderId
                        }
                        onChange={(event) =>
                          updateOrderStatus(
                            orderId,
                            event.target.value
                          )
                        }
                      >

                        {ORDER_STATUSES.map(
                          (statusOption) => (
                            <option
                              key={
                                statusOption
                              }
                              value={
                                statusOption
                              }
                            >
                              {statusOption}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    {updatingOrderId ===
                      orderId && (
                      <span className="updating-text">
                        Updating...
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </section>
  );
}

export default AdminOrders;