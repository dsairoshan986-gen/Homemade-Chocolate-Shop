import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setMessage("Registration successful! Redirecting to login...");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Go to login after 1.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-amber-900 text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Register to order your favorite chocolates
        </p>

        {/* Success Message */}
        {message && (
          <div className="mb-5 p-3 rounded-lg bg-green-100 text-green-700">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

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
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-amber-700 font-semibold hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;