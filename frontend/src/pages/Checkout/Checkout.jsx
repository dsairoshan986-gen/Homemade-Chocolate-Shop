import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import API_URL from "../../config/api";

function Checkout() {
  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD LOGGED-IN USER
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    // User must be logged in
    if (!token) {
      navigate("/login");
      return;
    }

    // Load user information
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        setFormData((currentData) => ({
          ...currentData,

          // Use logged-in user's information
          name: user?.name || "",
          email: user?.email || "",
        }));
      } catch (error) {
        console.error(
          "Failed to read logged-in user:",
          error
        );
      }
    }
  }, [navigate]);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // -------------------------------------------------------
      // GET TOKEN
      // -------------------------------------------------------

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // -------------------------------------------------------
      // CHECK CART
      // -------------------------------------------------------

      if (!cartItems || cartItems.length === 0) {
        setError("Your cart is empty.");
        return;
      }

      // -------------------------------------------------------
      // GET LOGGED-IN USER
      // -------------------------------------------------------

      const savedUser = localStorage.getItem("user");

      let loggedInUser = null;

      if (savedUser) {
        try {
          loggedInUser = JSON.parse(savedUser);
        } catch (error) {
          console.error(
            "Failed to parse logged-in user:",
            error
          );
        }
      }

      // -------------------------------------------------------
      // USE ACCOUNT EMAIL
      // -------------------------------------------------------

      const orderEmail =
        loggedInUser?.email || formData.email;

      const customerName =
        loggedInUser?.name || formData.name;

      // -------------------------------------------------------
      // CREATE ORDER DATA
      // -------------------------------------------------------

      const orderData = {
        customer_name: customerName,

        email: orderEmail,

        phone: formData.phone,

        address: formData.address,

        city: formData.city,

        state: formData.state,

        pincode: formData.pincode,

        total_amount: Number(cartTotal),

        items: cartItems.map((item) => ({
          product_id: Number(item.id),

          quantity: Number(item.quantity),

          price: Number(item.price),
        })),
      };

      console.log(
        "Sending Order:",
        orderData
      );

      // -------------------------------------------------------
      // SEND ORDER TO BACKEND
      // -------------------------------------------------------

      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(orderData),
        }
      );

      // -------------------------------------------------------
      // READ RESPONSE
      // -------------------------------------------------------

      const result = await response.json();

      console.log(
        "Order Response:",
        result
      );

      // -------------------------------------------------------
      // HANDLE BACKEND ERROR
      // -------------------------------------------------------

      if (!response.ok) {
        // Token expired or invalid
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");

          return;
        }

        throw new Error(
          result?.message ||
            "Failed to place order"
        );
      }

      // -------------------------------------------------------
      // ORDER SUCCESS
      // -------------------------------------------------------

      console.log(
        "Order created successfully:",
        result
      );

      // Clear shopping cart
      clearCart();

      // -------------------------------------------------------
      // GET ORDER ID
      // -------------------------------------------------------

      const orderId =
        result?.data?.id ||
        result?.order?.id ||
        result?.id;

      // -------------------------------------------------------
      // NAVIGATE TO SUCCESS PAGE
      // -------------------------------------------------------

      if (orderId) {
        navigate(
          `/order-success/${orderId}`
        );
      } else {
        navigate("/order-success");
      }
    } catch (error) {
      console.error(
        "Order Error:",
        error
      );

      setError(
        error?.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    return (
      <section className="min-h-screen bg-[#fffaf0] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">

          <div className="text-7xl mb-6">
            🛒
          </div>

          <h1 className="text-4xl font-bold text-amber-900">
            Your Cart is Empty
          </h1>

          <p className="text-gray-600 mt-4">
            Add some delicious chocolates
            before checkout.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
          >
            Continue Shopping
          </Link>

        </div>
      </section>
    );
  }

  // =========================================================
  // CHECKOUT PAGE
  // =========================================================

  return (
    <section className="min-h-screen bg-[#fffaf0] py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* PAGE TITLE */}

        <h1 className="text-4xl font-bold text-amber-900 mb-8">
          Checkout
        </h1>

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* =================================================
              CUSTOMER DETAILS
          ================================================= */}

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              Customer Details
            </h2>

            <form onSubmit={handleSubmit}>

              {/* NAME + EMAIL */}

              <div className="grid md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>

                  <label className="block font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="block font-semibold text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly
                    placeholder="Your account email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed focus:outline-none"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    This email comes from your logged-in account.
                  </p>

                </div>

                {/* PHONE */}

                <div>

                  <label className="block font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />

                </div>

                {/* CITY */}

                <div>

                  <label className="block font-semibold text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter your city"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />

                </div>

              </div>

              {/* ADDRESS */}

              <div className="mt-5">

                <label className="block font-semibold text-gray-700 mb-2">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter your complete delivery address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />

              </div>

              {/* STATE + PINCODE */}

              <div className="grid md:grid-cols-2 gap-5 mt-5">

                {/* STATE */}

                <div>

                  <label className="block font-semibold text-gray-700 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Enter your state"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />

                </div>

                {/* PINCODE */}

                <div>

                  <label className="block font-semibold text-gray-700 mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pincode"
                    placeholder="Enter pincode"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />

                </div>

              </div>

              {/* PLACE ORDER */}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-amber-700 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">

            <h2 className="text-2xl font-bold text-amber-900">
              Order Summary
            </h2>

            {/* PRODUCTS */}

            <div className="mt-6 space-y-4">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between gap-4"
                >

                  <div>

                    <p className="font-semibold text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <p className="font-semibold whitespace-nowrap">
                    ₹{" "}
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </p>

                </div>

              ))}

            </div>

            <hr className="my-6" />

            {/* SUBTOTAL */}

            <div className="flex justify-between text-gray-700">

              <span>
                Subtotal
              </span>

              <span>
                ₹ {Number(cartTotal).toFixed(2)}
              </span>

            </div>

            {/* DELIVERY */}

            <div className="flex justify-between text-gray-700 mt-3">

              <span>
                Delivery
              </span>

              <span className="text-green-700 font-medium">
                Free
              </span>

            </div>

            <hr className="my-5" />

            {/* TOTAL */}

            <div className="flex justify-between text-xl font-bold text-amber-900">

              <span>
                Total
              </span>

              <span>
                ₹ {Number(cartTotal).toFixed(2)}
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;