import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================
  // FETCH ORDERS
  // ============================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        // Get JWT token from localStorage
        const token = localStorage.getItem("token");

        // User is not logged in
        if (!token) {
          setError("Please login to view your orders.");
          setLoading(false);
          return;
        }

        // Call backend API
        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Orders API Response:", data);

        // Token expired / invalid
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setError(
            data.message ||
              "Your login session has expired. Please login again."
          );

          setLoading(false);
          return;
        }

        // Other backend error
        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders."
          );
        }

        // Backend returned success
        if (data.success) {
          setOrders(
            Array.isArray(data.data) ? data.data : []
          );
        } else {
          throw new Error(
            data.message || "Unable to load orders."
          );
        }
      } catch (err) {
        console.error("Fetch Orders Error:", err);

        setError(
          err.message ||
            "Something went wrong while loading your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const orderDate = new Date(date);

    if (Number.isNaN(orderDate.getTime())) {
      return "N/A";
    }

    return orderDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  // ============================================
  // FORMAT PRICE
  // ============================================

  const formatPrice = (price) => {
    const amount = Number(price);

    if (Number.isNaN(amount)) {
      return "₹0.00";
    }

    return `₹${amount.toFixed(2)}`;
  };


  // ============================================
  // LOGIN BUTTON
  // ============================================

  const handleLogin = () => {
    navigate("/login");
  };


  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">

          <div className="orders-page-header">
            <h1>My Orders</h1>
          </div>

          <div className="orders-loading">
            <div className="orders-spinner"></div>

            <h2>Loading your orders...</h2>

            <p>
              Please wait while we fetch your order history.
            </p>
          </div>

        </div>
      </main>
    );
  }


  // ============================================
  // ERROR
  // ============================================

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-container">

          <div className="orders-page-header">
            <h1>My Orders</h1>
          </div>

          <div className="orders-error-box">

            <div className="orders-error-icon">
              ⚠️
            </div>

            <h2>Unable to Load Orders</h2>

            <p>{error}</p>

            {!localStorage.getItem("token") && (
              <button
                className="orders-login-button"
                onClick={handleLogin}
              >
                Login
              </button>
            )}

          </div>

        </div>
      </main>
    );
  }


  // ============================================
  // NO ORDERS
  // ============================================

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-container">

          <div className="orders-page-header">
            <h1>My Orders</h1>

            <p>
              View and manage your chocolate orders.
            </p>
          </div>

          <div className="no-orders">

            <div className="no-orders-icon">
              📦
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will appear here.
            </p>

            <Link
              to="/products"
              className="start-shopping-button"
            >
              Shop Chocolates
            </Link>

          </div>

        </div>
      </main>
    );
  }


  // ============================================
  // ORDERS
  // ============================================

  return (
    <main className="orders-page">

      <div className="orders-container">

        {/* PAGE HEADER */}

        <div className="orders-page-header">

          <div>
            <h1>My Orders</h1>

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


        {/* ORDER LIST */}

        <div className="orders-list">

          {orders.map((order) => (

            <article
              className="order-card"
              key={order.id}
            >

              {/* ORDER HEADER */}

              <div className="order-card-header">

                <div className="order-number-section">

                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>
                    #{order.id}
                  </h2>

                </div>


                <div className="order-header-right">

                  <div className="order-date">

                    <span>
                      Order Date
                    </span>

                    <strong>
                      {formatDate(order.created_at)}
                    </strong>

                  </div>


                  <span
                    className={`order-status ${
                      order.status
                        ? order.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                        : "pending"
                    }`}
                  >
                    {order.status || "Pending"}
                  </span>

                </div>

              </div>


              {/* ORDER BODY */}

              <div className="order-card-body">

                <div className="order-information">

                  <div className="order-info-item">

                    <span className="info-label">
                      Customer
                    </span>

                    <span className="info-value">
                      {order.customer_name || "N/A"}
                    </span>

                  </div>


                  <div className="order-info-item">

                    <span className="info-label">
                      Email
                    </span>

                    <span className="info-value">
                      {order.email || "N/A"}
                    </span>

                  </div>


                  <div className="order-info-item">

                    <span className="info-label">
                      Phone
                    </span>

                    <span className="info-value">
                      {order.phone || "N/A"}
                    </span>

                  </div>


                  <div className="order-info-item">

                    <span className="info-label">
                      City
                    </span>

                    <span className="info-value">
                      {order.city || "N/A"}
                    </span>

                  </div>

                </div>


                {/* DELIVERY ADDRESS */}

                <div className="delivery-section">

                  <h3>
                    📍 Delivery Address
                  </h3>

                  <p>
                    {order.address || "N/A"}
                  </p>

                  <p>
                    {order.city || ""}
                    {order.city && order.state
                      ? ", "
                      : ""}
                    {order.state || ""}
                  </p>

                  <p>
                    Pincode: {order.pincode || "N/A"}
                  </p>

                </div>

              </div>


              {/* ORDER FOOTER */}

              <div className="order-card-footer">

                <div className="order-payment-info">

                  <span>
                    Order Status
                  </span>

                  <strong>
                    {order.status || "Pending"}
                  </strong>

                </div>


                <div className="order-total-section">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    {formatPrice(order.total_amount)}
                  </strong>

                </div>

              </div>

            </article>

          ))}

        </div>


        {/* SHOP MORE */}

        <div className="orders-shop-more">

          <Link
            to="/products"
            className="shop-more-button"
          >
            ← Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Orders;