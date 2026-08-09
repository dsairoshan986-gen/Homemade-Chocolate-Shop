import React, { useEffect, useState } from "react";
import "./Orders.css";

const API_URL = "http://localhost:5000/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // FETCH ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch orders"
        );
      }

      setOrders(result.data || []);

    } catch (err) {
      console.error("Fetch Orders Error:", err);

      setError(
        err.message || "Unable to load your orders."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="orders-page">

        <div className="orders-container">

          <div className="orders-loading">
            <div className="loading-spinner"></div>

            <h2>Loading Your Orders...</h2>

            <p>
              Please wait while we fetch your order history.
            </p>
          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="orders-page">

        <div className="orders-container">

          <div className="orders-error">

            <div className="error-icon">
              ⚠️
            </div>

            <h2>Unable to Load Orders</h2>

            <p>{error}</p>

            <button
              className="retry-button"
              onClick={fetchOrders}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // EMPTY ORDERS
  // ==========================================

  if (orders.length === 0) {
    return (
      <div className="orders-page">

        <div className="orders-container">

          <div className="orders-header">

            <div>
              <h1>My Orders</h1>

              <p>
                View your chocolate order history.
              </p>
            </div>

          </div>


          <div className="empty-orders">

            <div className="empty-icon">
              📦
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <a
              href="/products"
              className="shop-button"
            >
              Start Shopping
            </a>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // ORDERS PAGE
  // ==========================================

  return (
    <div className="orders-page">

      <div className="orders-container">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="orders-header">

          <div>

            <h1>
              My Orders
            </h1>

            <p>
              View your chocolate order history.
            </p>

          </div>


          <div className="orders-count">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </div>

        </div>


        {/* ================================= */}
        {/* ORDER LIST */}
        {/* ================================= */}

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >


              {/* ================================= */}
              {/* ORDER HEADER */}
              {/* ================================= */}

              <div className="order-header">

                <div className="order-number">

                  <span>
                    ORDER
                  </span>

                  <strong>
                    #{order.id}
                  </strong>

                </div>


                <div className="order-date">

                  <span>
                    Order Date
                  </span>

                  <strong>
                    {formatDate(order.created_at)}
                  </strong>

                </div>


                <div
                  className={`order-status ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </div>

              </div>


              {/* ================================= */}
              {/* CUSTOMER DETAILS */}
              {/* ================================= */}

              <div className="customer-details">

                <div className="customer-item">

                  <span>
                    Customer
                  </span>

                  <strong>
                    {order.customer_name}
                  </strong>

                </div>


                <div className="customer-item">

                  <span>
                    Email
                  </span>

                  <strong>
                    {order.email}
                  </strong>

                </div>


                <div className="customer-item">

                  <span>
                    Phone
                  </span>

                  <strong>
                    {order.phone}
                  </strong>

                </div>


                <div className="customer-item">

                  <span>
                    City
                  </span>

                  <strong>
                    {order.city}
                  </strong>

                </div>

              </div>


              {/* ================================= */}
              {/* DELIVERY ADDRESS */}
              {/* ================================= */}

              <div className="delivery-address">

                <h3>
                  📍 Delivery Address
                </h3>

                <p>
                  {order.address}
                </p>

                <p>
                  {order.city}, {order.state}
                </p>

                <p>
                  Pincode: {order.pincode}
                </p>

              </div>


              {/* ================================= */}
              {/* ORDER ITEMS */}
              {/* ================================= */}

              <div className="order-items-section">

                <h3>
                  🍫 Items Ordered
                </h3>


                <div className="order-items">

                  {Array.isArray(order.items) &&
                  order.items.length > 0 ? (

                    order.items.map((item) => {

                      const price =
                        Number(item.price) || 0;

                      const quantity =
                        Number(item.quantity) || 0;

                      const subtotal =
                        price * quantity;


                      return (
                        <div
                          className="order-item"
                          key={item.id}
                        >

                          <div className="item-icon">
                            🍫
                          </div>


                          <div className="item-details">

                            <h4>
                              {item.product_name ||
                                `Product #${item.product_id}`}
                            </h4>

                            <p>
                              Quantity: {quantity}
                            </p>

                          </div>


                          <div className="item-price">

                            <span>
                              ₹{price.toFixed(2)} × {quantity}
                            </span>

                            <strong>
                              ₹{subtotal.toFixed(2)}
                            </strong>

                          </div>

                        </div>
                      );

                    })

                  ) : (

                    <div className="no-items">
                      No item details available.
                    </div>

                  )}

                </div>

              </div>


              {/* ================================= */}
              {/* ORDER FOOTER */}
              {/* ================================= */}

              <div className="order-footer">

                <div className="order-status-text">

                  <span>
                    Order Status
                  </span>

                  <strong>
                    {order.status || "Pending"}
                  </strong>

                </div>


                <div className="order-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.total_amount || 0
                    ).toFixed(2)}
                  </strong>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  try {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch (error) {
    return date;
  }
}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

  const normalizedStatus =
    String(status || "Pending")
      .toLowerCase();


  if (normalizedStatus === "completed") {
    return "status-completed";
  }

  if (normalizedStatus === "delivered") {
    return "status-delivered";
  }

  if (normalizedStatus === "cancelled") {
    return "status-cancelled";
  }

  if (normalizedStatus === "processing") {
    return "status-processing";
  }

  return "status-pending";
}


export default Orders;