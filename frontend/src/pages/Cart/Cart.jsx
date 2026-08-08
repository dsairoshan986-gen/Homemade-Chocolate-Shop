import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-[#fffaf0] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <div className="text-7xl mb-6">
            🛒
          </div>

          <h1 className="text-4xl font-bold text-amber-900">
            Your Cart is Empty
          </h1>

          <p className="text-gray-600 mt-4">
            Looks like you haven't added any chocolates yet.
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

  return (
    <section className="min-h-screen bg-[#fffaf0] py-12 px-6">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-amber-900">
            Shopping Cart
          </h1>

          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-semibold"
          >
            Clear Cart
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}

          <div className="lg:col-span-2 space-y-5">

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-5 flex gap-5 items-center"
              >

                {/* Product Image */}

                <div className="w-32 h-32 flex-shrink-0">

                  <img
                    src={
                      item.name === "Dark Chocolate Truffles"
                        ? "/src/assets/images/products/dark-truffle.jpg"
                        : item.name === "Milk Chocolate"
                        ? "/src/assets/images/products/milk-chocolate.jpg"
                        : item.name === "White Chocolate"
                        ? "/src/assets/images/products/white-chocolate.jpg"
                        : "/src/assets/images/products/ferrero.jpg"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />

                </div>

                {/* Product Details */}

                <div className="flex-1">

                  <h2 className="text-xl font-bold text-amber-900">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    ₹ {item.price}
                  </p>

                  {/* Quantity */}

                  <div className="flex items-center gap-3 mt-4">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-amber-200 text-amber-900 font-bold"
                    >
                      -
                    </button>

                    <span className="font-bold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-amber-200 text-amber-900 font-bold"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* Item Total */}

                <div className="text-right">

                  <p className="text-xl font-bold text-red-600">
                    ₹{" "}
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="text-sm text-red-500 hover:text-red-700 mt-4"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* Order Summary */}

          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">

            <h2 className="text-2xl font-bold text-amber-900">
              Order Summary
            </h2>

            <div className="flex justify-between mt-6 text-gray-700">
              <span>Subtotal</span>

              <span>
                ₹ {cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mt-3 text-gray-700">
              <span>Delivery</span>

              <span>
                Free
              </span>
            </div>

            <hr className="my-5" />

            <div className="flex justify-between text-xl font-bold text-amber-900">

              <span>Total</span>

              <span>
                ₹ {cartTotal.toFixed(2)}
              </span>

            </div>

            <button
              className="w-full mt-6 bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block text-center mt-4 text-amber-700 hover:text-amber-900"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Cart;