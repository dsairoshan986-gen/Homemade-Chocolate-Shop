import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ---------------------------------------------------
    // Validation
    // ---------------------------------------------------

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // BACKEND LOGIN REQUEST
      // =================================================

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      // =================================================
      // LOGIN FAILED
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid email or password."
        );
      }

      // =================================================
      // GET USER DATA
      // =================================================

      const user =
        data.user ||
        data.data?.user ||
        data;

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token;

      // =================================================
      // CHECK TOKEN
      // =================================================

      if (!token) {
        throw new Error(
          "Login successful, but authentication token was not received."
        );
      }

      // =================================================
      // SAVE LOGIN INFORMATION
      // =================================================

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // ---------------------------------------------------
      // Save role separately also
      // ---------------------------------------------------

      const role = String(
        user?.role ||
        user?.accountType ||
        user?.userType ||
        ""
      ).toLowerCase();

      localStorage.setItem(
        "role",
        role
      );

      // =================================================
      // SUCCESS MESSAGE
      // =================================================

      setSuccess("Login successful!");

      // =================================================
      // ADMIN LOGIN
      // =================================================

      if (
        role === "admin" ||
        role === "administrator"
      ) {
        setTimeout(() => {
          navigate("/admin/dashboard", {
            replace: true,
          });
        }, 500);

        return;
      }

      // =================================================
      // CUSTOMER LOGIN
      // =================================================

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 500);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#fff8ef] flex justify-center px-5 py-16">

      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <div
        className="
          w-full
          max-w-[460px]
          h-fit
          bg-white
          rounded-3xl
          shadow-[0_10px_40px_rgba(107,46,11,0.12)]
          px-10
          py-10
          md:px-12
          md:py-12
        "
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex justify-center mb-7">

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-[#fff0dc]
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <span className="text-4xl">
              🍫
            </span>
          </div>

        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="text-center mb-8">

          <h1
            className="
              text-4xl
              font-bold
              text-[#71300d]
              mb-3
            "
          >
            Welcome Back
          </h1>

          <p className="text-[#526b88] text-base">
            Login to your Chocolate Shop account
          </p>

        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-red-700
              text-sm
              font-medium
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-4
              py-3
              text-green-700
              text-sm
              font-medium
            "
          >
            {success}
          </div>
        )}

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          {/* =================================================
              EMAIL
          ================================================= */}

          <div>

            <label
              htmlFor="email"
              className="
                block
                mb-2
                text-[#4a1f0b]
                font-bold
                text-base
              "
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              className="
                w-full
                h-14
                rounded-xl
                border
                border-[#decdbb]
                bg-white
                px-4
                text-[#3d2415]
                outline-none
                transition
                focus:border-[#c65300]
                focus:ring-2
                focus:ring-[#c65300]/20
                disabled:bg-gray-100
              "
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div>

            <label
              htmlFor="password"
              className="
                block
                mb-2
                text-[#4a1f0b]
                font-bold
                text-base
              "
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className="
                w-full
                h-14
                rounded-xl
                border
                border-[#decdbb]
                bg-white
                px-4
                text-[#3d2415]
                outline-none
                transition
                focus:border-[#c65300]
                focus:ring-2
                focus:ring-[#c65300]/20
                disabled:bg-gray-100
              "
            />

          </div>

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              h-14
              rounded-xl
              bg-[#d35400]
              text-white
              font-bold
              text-lg
              transition
              hover:bg-[#b94700]
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* =================================================
            REGISTER
        ================================================= */}

        <div className="text-center mt-7">

          <p className="text-[#526b88]">

            Don't have an account?

            <Link
              to="/register"
              className="
                ml-2
                font-bold
                text-[#c65300]
                hover:text-[#8f3d00]
              "
            >
              Create an account
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}

export default Login;