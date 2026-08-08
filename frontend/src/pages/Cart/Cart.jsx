import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

const imageMap = {
  "Dark Chocolate Truffles": darkTruffle,
  "Milk Chocolate": milkChocolate,
  "White Chocolate": whiteChocolate,
  "Ferrero Chocolate": ferrero,
};

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  // Get image for each product
  const getProductImage = (product) => {
    return imageMap[product.name] || darkTruffle;
  };

  // Empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffaf2]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-8">
            Shopping Cart
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="text-7xl mb-6">🛒</div>

            <h2 className="text-3xl font-semibold text-amber-900 mb-4">
              Your cart is empty
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              You haven't added any chocolates to your cart yet.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf2]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-amber-900">
            Shopping Cart
          </h1>

          <button
            onClick={clearCart}
            className="text-red-600 font-semibold hover:text-red-800"
          >
            Clear Cart
          </button>
        </div>

        {/* Main Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">

            {cartItems.map((item) => {
              const image = getProductImage(item);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6"
                >

                  {/* Product Image */}
                  <div className="w-full md:w-40 h-40 flex-shrink-0">
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>
                      <h2 className="text-2xl font-bold text-amber-900">
                        {item.name}
                      </h2>

                      <p className="text-gray-600 mt-2">
                        ₹ {Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-5">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        className="w-10 h-10 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xl font-bold"
                      >
                        -
                      </button>

                      <span className="text-xl font-bold min-w-[25px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        className="w-10 h-10 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xl font-bold"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* Item Total */}
                  <div className="flex flex-col items-end justify-between">

                    <p className="text-2xl font-bold text-red-600">
                      ₹{" "}
                      {(
                        Number(item.price) * item.quantity
                      ).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow-lg p-7 sticky top-6">

              <h2 className="text-2xl font-bold text-amber-900 mb-7">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between mb-5">
                <span className="text-gray-700">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹ {Number(cartTotal).toFixed(2)}
                </span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between mb-6">
                <span className="text-gray-700">
                  Delivery
                </span>

                <span className="text-green-700 font-medium">
                  Free
                </span>
              </div>

              <hr className="border-gray-300 mb-6" />

              {/* Total */}
              <div className="flex justify-between mb-7">
                <span className="text-2xl font-bold text-amber-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-amber-900">
                  ₹ {Number(cartTotal).toFixed(2)}
                </span>
              </div>

              {/* Checkout */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl text-lg font-bold transition"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate("/products")}
                className="w-full mt-5 text-orange-700 hover:text-orange-900 font-medium"
              >
                Continue Shopping
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;