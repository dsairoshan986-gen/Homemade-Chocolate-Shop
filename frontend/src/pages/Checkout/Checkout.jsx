import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

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

  // ==============================
  // CHECK LOGIN
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // ==============================
  // PLACE ORDER
  // ==============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      // Check token
      if (!token) {
        navigate("/login");
        return;
      }

      // Check cart
      if (!cartItems || cartItems.length === 0) {
        setError("Your cart is empty.");
        return;
      }

      // ==============================
      // CREATE ORDER DATA
      // ==============================
      const orderData = {
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,

        total_amount: Number(cartTotal),

        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      };

      console.log("Sending Order:", orderData);

      // ==============================
      // SEND ORDER TO BACKEND
      // ==============================
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(orderData),
        }
      );

      // ==============================
      // READ RESPONSE
      // ==============================
      const result = await response.json();

      console.log("Order Response:", result);

      // ==============================
      // HANDLE ERROR
      // ==============================
      if (!response.ok) {
        // If token is invalid/expired
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
          result.message || "Failed to place order"
        );
      }

      // ==============================
      // ORDER SUCCESS
      // ==============================
      console.log("Order created successfully:", result);

      // Clear cart
      clearCart();

      // Get order ID safely
      const orderId =
        result?.data?.id ||
        result?.order?.id ||
        result?.id;

      if (orderId) {
        navigate(`/order-success/${orderId}`);
      } else {
        navigate("/order-success");
      }

    } catch (error) {
      console.error("Order Error:", error);

      setError(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // EMPTY CART
  // ==============================
  if (cartItems.length === 0) {
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
            Add some delicious chocolates before checkout.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800"
          >
            Continue Shopping
          </Link>

        </div>
      </section>
    );
  }

  // ==============================
  // CHECKOUT PAGE
  // ==============================
  return (
    <section className="min-h-screen bg-[#fffaf0] py-12 px-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-amber-900 mb-8">
          Checkout
        </h1>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ==============================
              CUSTOMER DETAILS
          ============================== */}

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
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />

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
                    placeholder="Enter pincode"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />

                </div>

              </div>

              {/* PLACE ORDER BUTTON */}
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

          {/* ==============================
              ORDER SUMMARY
          ============================== */}

          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">

            <h2 className="text-2xl font-bold text-amber-900">
              Order Summary
            </h2>

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

                  <p className="font-semibold">
                    ₹{" "}
                    {(
                      Number(item.price) *
                      item.quantity
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

              <span>
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