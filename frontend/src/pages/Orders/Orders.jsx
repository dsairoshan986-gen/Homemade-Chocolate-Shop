import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USER ORDERS
  // ==========================================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      console.log("My Orders API response:", result);

      // ==========================================
      // TOKEN ERROR
      // ==========================================
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch orders"
        );
      }

      // ==========================================
      // HANDLE DIFFERENT RESPONSE FORMATS
      // ==========================================
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
      console.error("Orders Error:", err);

      setError(
        err.message || "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDERS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <section className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            Loading your orders...
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <section className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <h1>My Orders</h1>
          </div>

          <div className="orders-error">
            <h2>Unable to load orders</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={fetchOrders}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // NO ORDERS
  // ==========================================
  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <div>
              <p className="orders-label">
                📦 Order History
              </p>

              <h1>My Orders</h1>

              <p>
                View your previous chocolate orders here.
              </p>
            </div>
          </div>

          <div className="empty-orders">
            <div className="empty-orders-icon">
              📦
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="shop-button"
            >
              Shop Chocolates
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ORDERS PAGE
  // ==========================================
  return (
    <section className="orders-page">
      <div className="orders-container">

        {/* Header */}
        <div className="orders-header">
          <div>
            <p className="orders-label">
              📦 Order History
            </p>

            <h1>My Orders</h1>

            <p>
              View your previous chocolate orders here.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="refresh-button"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Orders */}
        <div className="orders-list">

          {orders.map((order) => {

            const orderItems =
              Array.isArray(order.items)
                ? order.items
                : [];

            const orderId =
              order.id ||
              order.order_id;

            const total =
              Number(
                order.total_amount ||
                order.total ||
                0
              );

            return (
              <div
                key={orderId}
                className="order-card"
              >

                {/* Order Header */}
                <div className="order-card-header">

                  <div>
                    <p className="order-number">
                      Order #{orderId}
                    </p>

                    <p className="order-date">
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="order-status">
                    {order.status || "Pending"}
                  </div>

                </div>

                {/* Customer */}
                <div className="order-customer">

                  {order.customer_name && (
                    <p>
                      <strong>
                        Customer:
                      </strong>{" "}
                      {order.customer_name}
                    </p>
                  )}

                  {order.email && (
                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {order.email}
                    </p>
                  )}

                  {order.phone && (
                    <p>
                      <strong>
                        Phone:
                      </strong>{" "}
                      {order.phone}
                    </p>
                  )}

                  {order.address && (
                    <p>
                      <strong>
                        Address:
                      </strong>{" "}
                      {order.address}
                      {order.city
                        ? `, ${order.city}`
                        : ""}
                      {order.state
                        ? `, ${order.state}`
                        : ""}
                      {order.pincode
                        ? ` - ${order.pincode}`
                        : ""}
                    </p>
                  )}

                </div>

                {/* Products */}
                <div className="order-items">

                  <h3>
                    Products
                  </h3>

                  {orderItems.length > 0 ? (
                    orderItems.map(
                      (item, index) => (
                        <div
                          key={
                            item.id ||
                            `${orderId}-${index}`
                          }
                          className="order-item"
                        >

                          <div>
                            <p className="item-name">
                              {item.product_name ||
                                item.name ||
                                `Product #${item.product_id}`}
                            </p>

                            <p className="item-quantity">
                              Quantity:{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="item-price">
                            ₹{" "}
                            {(
                              Number(
                                item.price || 0
                              ) *
                              Number(
                                item.quantity || 0
                              )
                            ).toFixed(2)}
                          </p>

                        </div>
                      )
                    )
                  ) : (
                    <p className="no-items">
                      Order item details unavailable.
                    </p>
                  )}

                </div>

                {/* Total */}
                <div className="order-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹ {total.toFixed(2)}
                  </strong>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default Orders;