import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-6xl font-bold text-amber-800">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mt-3">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;