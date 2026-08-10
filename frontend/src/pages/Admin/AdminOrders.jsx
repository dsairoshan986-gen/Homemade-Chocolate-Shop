import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const API_URL = "http://localhost:5000/api";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [message, setMessage] = useState("");

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH ALL ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = getToken();

      // -------------------------------------------------
      // TOKEN CHECK
      // -------------------------------------------------

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );

        navigate("/login");

        return;
      }

      console.log("Fetching admin orders...");

      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

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

      // -------------------------------------------------
      // READ RESPONSE
      // -------------------------------------------------

      const result = await response.json();

      console.log(
        "ADMIN ORDERS RESPONSE:",
        result
      );

      // -------------------------------------------------
      // AUTH ERROR
      // -------------------------------------------------

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      // -------------------------------------------------
      // API ERROR
      // -------------------------------------------------

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to fetch orders"
        );
      }

      // -------------------------------------------------
      // EXTRACT ORDERS
      // -------------------------------------------------

      let ordersData = [];

      if (Array.isArray(result)) {
        ordersData = result;
      } else if (
        Array.isArray(result?.data)
      ) {
        ordersData = result.data;
      } else if (
        Array.isArray(result?.orders)
      ) {
        ordersData = result.orders;
      }

      setOrders(ordersData);

      console.log(
        `ADMIN ORDERS: ${ordersData.length} orders loaded`
      );
    } catch (err) {
      console.error(
        "Admin Orders Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");
      setMessage("");

      const token = getToken();

      // -------------------------------------------------
      // TOKEN CHECK
      // -------------------------------------------------

      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      console.log(
        "Updating order:",
        orderId,
        "to:",
        newStatus
      );

      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

      const response = await fetch(
        `${API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      // -------------------------------------------------
      // READ RESPONSE
      // -------------------------------------------------

      const result =
        await response.json();

      console.log(
        "UPDATE ORDER RESPONSE:",
        result
      );

      // -------------------------------------------------
      // AUTH ERROR
      // -------------------------------------------------

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      // -------------------------------------------------
      // API ERROR
      // -------------------------------------------------

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update order status"
        );
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setMessage(
        `Order #${orderId} status updated successfully.`
      );

      // -------------------------------------------------
      // UPDATE LOCAL STATE
      // -------------------------------------------------

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          Number(order.id) ===
          Number(orderId)
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Update Order Status Error:",
        err
      );

      setError(
        err?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
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
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );
    } catch {
      return date;
    }
  };

  // =====================================================
  // GET STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const normalizedStatus = String(
      status || "Pending"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `order-status status-${normalizedStatus}`;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="admin-orders-page">
        <div className="admin-orders-container">

          <div className="admin-orders-loading">
            <div className="admin-orders-spinner"></div>

            <p>
              Loading orders...
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
              className="back-link"
            >
              ← Back to Dashboard
            </Link>

            <p className="admin-orders-label">
              📦 ADMINISTRATION
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
            onClick={fetchOrders}
            className="refresh-orders-btn"
          >
            ↻ Refresh
          </button>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="admin-orders-success">
            {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="admin-orders-error">

            <div>

              <h3>
                Unable to load orders
              </h3>

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
            TOTAL ORDERS
        ================================================= */}

        {!error && (
          <div className="admin-orders-count">

            <span>
              Total Orders:
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>
        )}

        {/* =================================================
            EMPTY ORDERS
        ================================================= */}

        {!error &&
          orders.length === 0 && (
            <div className="no-orders">

              <div className="no-orders-icon">
                📦
              </div>

              <h2>
                No Orders Found
              </h2>

              <p>
                There are currently no customer
                orders.
              </p>

            </div>
          )}

        {/* =================================================
            ORDERS
        ================================================= */}

        {!error &&
          orders.length > 0 && (
            <div className="admin-orders-list">

              {orders.map((order) => (

                <div
                  key={
                    order.id ||
                    order.order_id
                  }
                  className="admin-order-card"
                >

                  {/* =======================================
                      ORDER HEADER
                  ======================================= */}

                  <div className="admin-order-header">

                    <div>

                      <p className="order-number-label">
                        Order Number
                      </p>

                      <h2>
                        Order #
                        {order.id ||
                          order.order_id}
                      </h2>

                      <p className="order-date">
                        {formatDate(
                          order.created_at
                        )}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div className="order-status-section">

                      <label>
                        Order Status
                      </label>

                      <select
                        value={
                          order.status ||
                          "Pending"
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order.id ||
                              order.order_id,
                            event.target.value
                          )
                        }
                        disabled={
                          updatingOrderId ===
                          (order.id ||
                            order.order_id)
                        }
                        className={getStatusClass(
                          order.status
                        )}
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                      {updatingOrderId ===
                        (order.id ||
                          order.order_id) && (
                        <small>
                          Updating...
                        </small>
                      )}

                    </div>

                  </div>

                  {/* =======================================
                      CUSTOMER DETAILS
                  ======================================= */}

                  <div className="customer-details">

                    <h3>
                      Customer Details
                    </h3>

                    <div className="customer-grid">

                      <div>

                        <p>
                          <strong>
                            Customer:
                          </strong>{" "}
                          {order.customer_name ||
                            "N/A"}
                        </p>

                        <p>
                          <strong>
                            Phone:
                          </strong>{" "}
                          {order.phone ||
                            "N/A"}
                        </p>

                        <p>
                          <strong>
                            State:
                          </strong>{" "}
                          {order.state ||
                            "N/A"}
                        </p>

                      </div>

                      <div>

                        <p>
                          <strong>
                            Email:
                          </strong>{" "}
                          {order.email ||
                            "N/A"}
                        </p>

                        <p>
                          <strong>
                            City:
                          </strong>{" "}
                          {order.city ||
                            "N/A"}
                        </p>

                        <p>
                          <strong>
                            Pincode:
                          </strong>{" "}
                          {order.pincode ||
                            "N/A"}
                        </p>

                      </div>

                    </div>

                    <div className="delivery-address">

                      <strong>
                        Delivery Address:
                      </strong>

                      <p>
                        {order.address ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                  {/* =======================================
                      ORDER ITEMS
                  ======================================= */}

                  <div className="order-items-section">

                    <h3>
                      Order Items
                    </h3>

                    {Array.isArray(
                      order.items
                    ) &&
                    order.items.length > 0 ? (

                      <div className="order-items">

                        {order.items.map(
                          (item) => (

                            <div
                              key={
                                item.id ||
                                `${order.id}-${item.product_id}`
                              }
                              className="order-item"
                            >

                              <div className="order-item-info">

                                <strong>
                                  {
                                    item.product_name
                                  }
                                </strong>

                                <span>
                                  Quantity:{" "}
                                  {
                                    item.quantity
                                  }
                                </span>

                              </div>

                              <div className="order-item-price">

                                {formatPrice(
                                  Number(
                                    item.price
                                  ) *
                                    Number(
                                      item.quantity
                                    )
                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="no-order-items">
                        No order items found.
                      </p>

                    )}

                  </div>

                  {/* =======================================
                      ORDER TOTAL
                  ======================================= */}

                  <div className="order-total-section">

                    <span>
                      Order Total
                    </span>

                    <strong>
                      {formatPrice(
                        order.total_amount ||
                          order.total
                      )}
                    </strong>

                  </div>

                </div>

              ))}

            </div>
          )}

      </div>

    </section>
  );
}

export default AdminOrders;