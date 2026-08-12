import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Login failed. Please try again."
        );
      }

      // Save JWT token
      localStorage.setItem("token", result.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      setSuccess("Login successful!");

      // Go to home page
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">
            🍫
          </div>

          <h1 className="text-3xl font-bold text-amber-900">
            Welcome Back
          </h1>

          <p className="text-gray-600 mt-2">
            Login to your Chocolate Shop account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              required
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="text-amber-700 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;