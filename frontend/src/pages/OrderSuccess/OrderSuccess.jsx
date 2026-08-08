import { Link, useParams } from "react-router-dom";

function OrderSuccess() {
  const { id } = useParams();

  return (
    <section className="min-h-screen bg-[#fffaf0] flex items-center justify-center px-6">

      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full text-center">

        <div className="text-7xl mb-6">
          ✅
        </div>

        <h1 className="text-4xl font-bold text-amber-900">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-5">
          Thank you for shopping with Homemade Chocolate Shop.
        </p>

        <div className="bg-amber-50 rounded-lg p-4 mt-6">
          <p className="text-gray-700">
            Your Order ID
          </p>

          <p className="text-2xl font-bold text-amber-800 mt-2">
            #{id}
          </p>
        </div>

        <p className="text-gray-500 mt-5">
          We have received your order and will process it shortly.
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

export default OrderSuccess;