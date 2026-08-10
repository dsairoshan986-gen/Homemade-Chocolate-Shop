import { useEffect, useState } from "react";
import "./AdminOrders.css";

const API_URL = "http://localhost:5000";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // =====================================================
  // FETCH ALL ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      console.log("Fetching admin orders...");

      const response = await fetch(
        `${API_URL}/api/admin/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      console.log("ADMIN ORDERS RESPONSE:", result);

      // ===================================================
      // AUTHORIZATION ERROR
      // ===================================================

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError("Your session has expired. Please login again.");
        return;
      }

      // ===================================================
      // OTHER API ERROR
      // ===================================================

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch orders"
        );
      }

      // ===================================================
      // HANDLE RESPONSE
      // ===================================================

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
      console.error("Admin Orders Error:", err);

      setError(
        err.message || "Failed to load admin orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      setUpdatingOrderId(orderId);

      console.log(
        `Updating order ${orderId} to ${newStatus}`
      );

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
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

      const result = await response.json();

      console.log(
        "UPDATE ORDER STATUS RESPONSE:",
        result
      );

      // ===================================================
      // AUTHORIZATION ERROR
      // ===================================================

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      // ===================================================
      // API ERROR
      // ===================================================

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update order status"
        );
      }

      // ===================================================
      // UPDATE LOCAL STATE IMMEDIATELY
      // ===================================================

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          Number(order.id) === Number(orderId)
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      console.log(
        `Order #${orderId} updated to ${newStatus}`
      );

      // ===================================================
      // FETCH AGAIN TO CONFIRM DATABASE VALUE
      // ===================================================

      await fetchOrders();
    } catch (err) {
      console.error(
        "Update Order Status Error:",
        err
      );

      setError(
        err.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =====================================================
  // LOAD ORDERS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="admin-orders-page">
        <div className="admin-orders-container">

          <div className="admin-orders-header">
            <div>
              <p className="admin-label">
                📦 ADMINISTRATION
              </p>

              <h1>Manage Orders</h1>

              <p>
                View customer orders and update their status.
              </p>
            </div>
          </div>

          <div className="admin-orders-loading">
            Loading orders...
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
            <p className="admin-label">
              📦 ADMINISTRATION
            </p>

            <h1>Manage Orders</h1>

            <p>
              View customer orders and update their status.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchOrders}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="admin-orders-error">

            <h3>
              Unable to load orders
            </h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchOrders}
              className="admin-retry-button"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            ORDER COUNT
        ================================================= */}

        {!error && (
          <div className="admin-order-count">
            <span>Total Orders:</span>

            <strong>
              {orders.length}
            </strong>
          </div>
        )}

        {/* =================================================
            NO ORDERS
        ================================================= */}

        {!error && orders.length === 0 && (
          <div className="admin-empty-orders">

            <div className="admin-empty-icon">
              📦
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              There are currently no customer orders.
            </p>

          </div>
        )}

        {/* =================================================
            ORDERS LIST
        ================================================= */}

        {!error && orders.length > 0 && (
          <div className="admin-orders-list">

            {orders.map((order) => {

              const orderId =
                order.id ||
                order.order_id;

              const orderItems =
                Array.isArray(order.items)
                  ? order.items
                  : [];

              const totalAmount = Number(
                order.total_amount ||
                order.total ||
                0
              );

              const currentStatus =
                order.status || "Pending";

              return (
                <div
                  className="admin-order-card"
                  key={orderId}
                >

                  {/* =================================================
                      ORDER HEADER
                  ================================================= */}

                  <div className="admin-order-header">

                    <div>
                      <span className="admin-order-label">
                        Order Number
                      </span>

                      <h2>
                        Order #{orderId}
                      </h2>

                      <p className="admin-order-date">
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    {/* =================================================
                        STATUS DROPDOWN
                    ================================================= */}

                    <div className="admin-status-container">

                      <label
                        htmlFor={`status-${orderId}`}
                      >
                        Order Status
                      </label>

                      <select
                        id={`status-${orderId}`}
                        value={currentStatus}
                        disabled={
                          updatingOrderId === orderId
                        }
                        onChange={(event) =>
                          updateOrderStatus(
                            orderId,
                            event.target.value
                          )
                        }
                        className={`admin-status-select status-${currentStatus
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >

                        {ORDER_STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}

                      </select>

                      {updatingOrderId ===
                        orderId && (
                        <span className="status-updating">
                          Updating...
                        </span>
                      )}

                    </div>

                  </div>

                  {/* =================================================
                      CUSTOMER DETAILS
                  ================================================= */}

                  <div className="admin-customer-section">

                    <h3>
                      Customer Details
                    </h3>

                    <div className="admin-customer-grid">

                      <p>
                        <strong>
                          Customer:
                        </strong>{" "}
                        {order.customer_name ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {order.email ||
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
                          City:
                        </strong>{" "}
                        {order.city ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          State:
                        </strong>{" "}
                        {order.state ||
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

                    <div className="admin-address">

                      <strong>
                        Delivery Address:
                      </strong>

                      <p>
                        {order.address ||
                          "Address unavailable"}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      PRODUCTS
                  ================================================= */}

                  <div className="admin-products-section">

                    <h3>
                      Products
                    </h3>

                    {orderItems.length > 0 ? (
                      <div className="admin-products-list">

                        {orderItems.map(
                          (item, index) => {

                            const quantity =
                              Number(
                                item.quantity ||
                                  0
                              );

                            const price =
                              Number(
                                item.price ||
                                  0
                              );

                            const itemTotal =
                              price *
                              quantity;

                            return (
                              <div
                                className="admin-product-item"
                                key={
                                  item.id ||
                                  `${orderId}-${index}`
                                }
                              >

                                <div>
                                  <p className="admin-product-name">
                                    {item.product_name ||
                                      item.name ||
                                      `Product #${item.product_id}`}
                                  </p>

                                  <p className="admin-product-quantity">
                                    Quantity:{" "}
                                    {quantity}
                                  </p>
                                </div>

                                <div className="admin-product-price">
                                  ₹{" "}
                                  {itemTotal.toFixed(
                                    2
                                  )}
                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>
                    ) : (
                      <p className="admin-no-products">
                        Product details unavailable.
                      </p>
                    )}

                  </div>

                  {/* =================================================
                      TOTAL
                  ================================================= */}

                  <div className="admin-order-total">

                    <span>
                      Order Total
                    </span>

                    <strong>
                      ₹{" "}
                      {totalAmount.toFixed(2)}
                    </strong>

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