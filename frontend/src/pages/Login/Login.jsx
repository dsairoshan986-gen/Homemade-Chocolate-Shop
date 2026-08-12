import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../../config/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Attempting login...");

      // -------------------------------------------------
      // LOGIN REQUEST
      // -------------------------------------------------

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      console.log("LOGIN RESPONSE:", result);

      // -------------------------------------------------
      // LOGIN FAILED
      // -------------------------------------------------

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Invalid email or password."
        );

        return;
      }

      // -------------------------------------------------
      // CHECK TOKEN
      // -------------------------------------------------

      if (!result.token) {
        setError(
          "Login succeeded, but no authentication token was received."
        );

        return;
      }

      // -------------------------------------------------
      // CHECK USER
      // -------------------------------------------------

      if (!result.user) {
        setError(
          "Login succeeded, but user information was not received."
        );

        return;
      }

      console.log(
        "Logged in user:",
        result.user
      );

      console.log(
        "User role:",
        result.user.role
      );

      // -------------------------------------------------
      // SAVE TOKEN
      // -------------------------------------------------

      localStorage.setItem(
        "token",
        result.token
      );

      // -------------------------------------------------
      // SAVE USER
      // -------------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      console.log(
        "Token saved:",
        localStorage.getItem("token")
      );

      console.log(
        "User saved:",
        JSON.parse(
          localStorage.getItem("user")
        )
      );

      // -------------------------------------------------
      // ADMIN REDIRECT
      // -------------------------------------------------

      if (
        String(result.user.role).toLowerCase() ===
        "admin"
      ) {
        console.log(
          "Admin detected → redirecting to dashboard"
        );

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      // -------------------------------------------------
      // CUSTOMER REDIRECT
      // -------------------------------------------------

      console.log(
        "Customer detected → redirecting to home"
      );

      navigate(
        "/",
        {
          replace: true,
        }
      );

    } catch (err) {
      console.error(
        "Login Error:",
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
          BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#efd6bc] opacity-40" />

        <div className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full bg-[#efd6bc] opacity-40" />

      </div>

      {/* =================================================
          LOGIN CARD
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
              Welcome Back
            </h1>

            <p className="mt-3 text-gray-600">
              Login to your Chocolate Shop account
            </p>

          </div>

          {/* =============================================
              FORM
          ============================================== */}

          <form
            onSubmit={handleSubmit}
            className="px-8 pb-10"
          >

            {/* ERROR */}

            {error && (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* EMAIL */}

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

            {/* PASSWORD */}

            <div className="mb-6">

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
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#b84d00] px-6 py-4 text-white font-bold text-lg shadow-md transition hover:bg-[#963f00] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">

                  <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />

                  Logging in...

                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* REGISTER */}

            <div className="text-center mt-7">

              <p className="text-gray-600">
                Don't have an account?
              </p>

              <Link
                to="/register"
                className="inline-block mt-1 font-bold text-[#b84d00] hover:text-[#8a3d0c] hover:underline"
              >
                Create an account
              </Link>

            </div>

          </form>

        </div>

        {/* BRANDING */}

        <div className="text-center mt-6">

          <p className="text-sm text-gray-500">
            🍫 Handmade with love
          </p>

        </div>

      </div>

    </main>
  );
}

export default Login;