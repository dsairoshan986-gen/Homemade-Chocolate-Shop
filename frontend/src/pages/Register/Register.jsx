import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../../config/api";

function Register() {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword =
      formData.confirmPassword;

    // Name
    if (!name) {
      return "Please enter your name.";
    }

    if (name.length < 2) {
      return "Name must contain at least 2 characters.";
    }

    // Email
    if (!email) {
      return "Please enter your email address.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // Password
    if (!password) {
      return "Please enter a password.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    // Confirm password
    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  // =====================================================
  // HANDLE REGISTER
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ---------------------------------------------------
    // VALIDATE
    // ---------------------------------------------------

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      console.log(
        "Attempting registration..."
      );

      // -------------------------------------------------
      // REGISTER API
      // -------------------------------------------------

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "REGISTER RESPONSE:",
        result
      );

      // -------------------------------------------------
      // REGISTRATION FAILED
      // -------------------------------------------------

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Registration failed. Please try again."
        );

        return;
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // -------------------------------------------------
      // REDIRECT TO LOGIN
      // -------------------------------------------------

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (err) {
      console.error(
        "Registration Error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-[#fff5e8] flex items-center justify-center px-6 py-12">

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#efd6bc] opacity-40" />

        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-[#efd6bc] opacity-40" />

      </div>

      {/* =================================================
          REGISTER CARD
      ================================================= */}

      <div className="relative w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl border border-[#f0dfce] overflow-hidden">

          {/* =============================================
              HEADER
          ============================================== */}

          <div className="px-8 pt-10 pb-6 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#fff0df] flex items-center justify-center text-4xl shadow-sm">
              🍫
            </div>

            <h1 className="mt-6 text-4xl font-extrabold text-[#6b2e0b]">
              Create Account
            </h1>

            <p className="mt-3 text-gray-600">
              Join our Chocolate Shop family
            </p>

          </div>

          {/* =============================================
              FORM
          ============================================== */}

          <form
            onSubmit={handleSubmit}
            className="px-8 pb-10"
          >

            {/* =========================================
                ERROR MESSAGE
            ========================================== */}

            {error && (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* =========================================
                SUCCESS MESSAGE
            ========================================== */}

            {success && (
              <div
                className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                role="status"
              >
                {success}
              </div>
            )}

            {/* =========================================
                NAME
            ========================================== */}

            <div className="mb-5">

              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-800 outline-none transition focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20 disabled:bg-gray-100"
              />

            </div>

            {/* =========================================
                EMAIL
            ========================================== */}

            <div className="mb-5">

              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-800 outline-none transition focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20 disabled:bg-gray-100"
              />

            </div>

            {/* =========================================
                PASSWORD
            ========================================== */}

            <div className="mb-5">

              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-16 text-gray-800 outline-none transition focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-semibold text-gray-500 hover:text-[#8a3d0c]"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <p className="text-xs text-gray-500 mt-2">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* =========================================
                CONFIRM PASSWORD
            ========================================== */}

            <div className="mb-6">

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-16 text-gray-800 outline-none transition focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-sm font-semibold text-gray-500 hover:text-[#8a3d0c]"
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* =========================================
                REGISTER BUTTON
            ========================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#b84d00] px-6 py-4 text-white font-bold text-lg shadow-md transition hover:bg-[#963f00] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">

                  <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />

                  Creating Account...

                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* =========================================
                LOGIN LINK
            ========================================== */}

            <div className="text-center mt-7">

              <p className="text-gray-600">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="inline-block mt-1 font-bold text-[#b84d00] hover:text-[#8a3d0c] hover:underline"
              >
                Login to your account
              </Link>

            </div>

          </form>

        </div>

        {/* =================================================
            BRANDING
        ================================================= */}

        <div className="text-center mt-6">

          <p className="text-sm text-gray-500">
            🍫 Handmade with love
          </p>

        </div>

      </div>

    </main>
  );
}

export default Register;