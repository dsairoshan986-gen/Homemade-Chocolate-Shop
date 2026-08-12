import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import API_URL from "../../config/api";

function Profile() {
  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] =
    useState(null);

  // =====================================================
  // EDIT MODE
  // =====================================================

  const [isEditing, setIsEditing] =
    useState(false);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  // =====================================================
  // STATUS
  // =====================================================

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const userData =
      localStorage.getItem("user");

    // ---------------------------------------------------
    // NOT LOGGED IN
    // ---------------------------------------------------

    if (
      !token ||
      !userData
    ) {
      navigate(
        "/login",
        {
          replace: true,
        }
      );

      return;
    }

    // ---------------------------------------------------
    // PARSE USER
    // ---------------------------------------------------

    try {
      const parsedUser =
        JSON.parse(userData);

      setUser(parsedUser);

      setName(
        parsedUser.name || ""
      );

      setPhone(
        parsedUser.phone || ""
      );

    } catch (err) {
      console.error(
        "Failed to load user:",
        err
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    }
  }, [navigate]);

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  const isAdmin =
    user?.role === "admin";

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEditProfile = () => {
    setName(
      user?.name || ""
    );

    setPhone(
      user?.phone || ""
    );

    setMessage("");
    setError("");

    setIsEditing(true);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setName(
      user?.name || ""
    );

    setPhone(
      user?.phone || ""
    );

    setMessage("");
    setError("");

    setIsEditing(false);
  };

  // =====================================================
  // HANDLE PHONE
  // =====================================================

  const handlePhoneChange = (
    event
  ) => {
    const value =
      event.target.value.replace(
        /\D/g,
        ""
      );

    if (
      value.length <= 10
    ) {
      setPhone(value);
    }

    setError("");
    setMessage("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile =
    async (event) => {
      event.preventDefault();

      setMessage("");
      setError("");

      // -------------------------------------------------
      // NAME
      // -------------------------------------------------

      const cleanName =
        name.trim();

      if (!cleanName) {
        setError(
          "Please enter your full name."
        );

        return;
      }

      if (
        cleanName.length < 2
      ) {
        setError(
          "Name must contain at least 2 characters."
        );

        return;
      }

      // -------------------------------------------------
      // PHONE FOR CUSTOMER ONLY
      // -------------------------------------------------

      const cleanPhone =
        phone.trim();

      if (!isAdmin) {
        if (!cleanPhone) {
          setError(
            "Please enter your phone number."
          );

          return;
        }

        const phoneRegex =
          /^[6-9]\d{9}$/;

        if (
          !phoneRegex.test(
            cleanPhone
          )
        ) {
          setError(
            "Please enter a valid 10-digit Indian phone number."
          );

          return;
        }
      }

      // -------------------------------------------------
      // TOKEN
      // -------------------------------------------------

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      // -------------------------------------------------
      // SAVE
      // -------------------------------------------------

      try {
        setSaving(true);

        const body = isAdmin
          ? {
              name: cleanName,
            }
          : {
              name: cleanName,
              phone: cleanPhone,
            };

        console.log(
          "Updating profile:",
          body
        );

        const response =
          await fetch(
            `${API_URL}/auth/profile`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  body
                ),
            }
          );

        const result =
          await response.json();

        console.log(
          "UPDATE PROFILE RESPONSE:",
          result
        );

        // -------------------------------------------------
        // AUTH ERROR
        // -------------------------------------------------

        if (
          response.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        // -------------------------------------------------
        // API ERROR
        // -------------------------------------------------

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to update profile."
          );
        }

        // -------------------------------------------------
        // UPDATED USER
        // -------------------------------------------------

        const updatedUser =
          result.user;

        // -------------------------------------------------
        // UPDATE LOCAL STORAGE
        // -------------------------------------------------

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        // -------------------------------------------------
        // UPDATE TOKEN
        // -------------------------------------------------

        if (result.token) {
          localStorage.setItem(
            "token",
            result.token
          );
        }

        // -------------------------------------------------
        // UPDATE STATE
        // -------------------------------------------------

        setUser(
          updatedUser
        );

        setName(
          updatedUser.name ||
            ""
        );

        setPhone(
          updatedUser.phone ||
            ""
        );

        // -------------------------------------------------
        // CLOSE EDIT
        // -------------------------------------------------

        setIsEditing(false);

        // -------------------------------------------------
        // SUCCESS
        // -------------------------------------------------

        setMessage(
          "Profile updated successfully."
        );

        // -------------------------------------------------
        // INFORM NAVBAR
        // -------------------------------------------------

        window.dispatchEvent(
          new Event(
            "authChanged"
          )
        );

      } catch (err) {
        console.error(
          "Update Profile Error:",
          err
        );

        setError(
          err.message ||
            "Failed to update profile."
        );

      } finally {
        setSaving(false);
      }
    };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fff8ef] flex items-center justify-center">

        <p className="text-xl text-[#6b2e0b]">
          Loading profile...
        </p>

      </main>
    );
  }

  // =====================================================
  // INITIALS
  // =====================================================

  const initials =
    user.name
      ? user.name
          .split(" ")
          .filter(Boolean)
          .map(
            (word) =>
              word[0]
          )
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "U";

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-[#fff8ef] py-12 px-6">

      <div className="max-w-5xl mx-auto">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm">

            <span>
              🍫
            </span>

            <span className="font-semibold text-[#8a3d0c]">
              My Account
            </span>

          </div>

          <h1 className="mt-5 text-5xl font-extrabold text-[#6b2e0b]">
            My Profile
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your account and view your information.
          </p>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-800 font-semibold">
            ✅ {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800 font-semibold">
            ❌ {error}
          </div>
        )}

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-xl border border-[#f0dfce] overflow-hidden">

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="bg-[#6b2e0b] px-8 py-10 text-white">

            <div className="flex flex-col sm:flex-row items-center gap-6">

              {/* AVATAR */}

              <div className="w-28 h-28 rounded-full bg-[#fff0df] text-[#6b2e0b] flex items-center justify-center text-4xl font-extrabold shadow-lg">
                {initials}
              </div>

              {/* USER */}

              <div className="text-center sm:text-left">

                <h2 className="text-3xl font-bold">
                  {user.name}
                </h2>

                <p className="mt-2 text-[#f8dfc5]">
                  {user.email}
                </p>

                <span className="inline-block mt-3 bg-[#b84d00] px-4 py-1.5 rounded-full text-sm font-semibold capitalize">
                  {user.role ||
                    "customer"}
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              PROFILE INFORMATION
          ================================================= */}

          <div className="p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <h3 className="text-2xl font-bold text-[#6b2e0b]">
                Account Information
              </h3>

              {!isEditing && (
                <button
                  type="button"
                  onClick={
                    handleEditProfile
                  }
                  className="rounded-xl bg-[#6b2e0b] px-6 py-3 text-white font-bold hover:bg-[#4a1f0b] transition"
                >
                  ✏️ Edit Profile
                </button>
              )}

            </div>

            {/* =================================================
                EDIT FORM
            ================================================= */}

            {isEditing ? (

              <form
                onSubmit={
                  handleSaveProfile
                }
                className="mt-6"
              >

                {/* NAME */}

                <div className="bg-[#fff8ef] rounded-2xl p-6 border border-[#f0dfce]">

                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-semibold text-gray-600"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(
                      event
                    ) => {
                      setName(
                        event.target
                          .value
                      );

                      setError("");
                      setMessage("");
                    }}
                    maxLength={100}
                    disabled={saving}
                    autoFocus
                    className="mt-2 w-full rounded-xl border border-[#dfcdbb] bg-white px-4 py-3.5 text-lg text-gray-800 outline-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20 disabled:opacity-60"
                  />

                </div>

                {/* =================================================
                    PHONE
                    CUSTOMER ONLY
                ================================================= */}

                {!isAdmin && (
                  <div className="mt-5 bg-[#fff8ef] rounded-2xl p-6 border border-[#f0dfce]">

                    <label
                      htmlFor="profile-phone"
                      className="block text-sm font-semibold text-gray-600"
                    >
                      Phone Number
                    </label>

                    <div className="flex mt-2">

                      <span className="flex items-center px-4 rounded-l-xl border border-r-0 border-[#dfcdbb] bg-gray-100 text-gray-700 font-semibold">
                        +91
                      </span>

                      <input
                        id="profile-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        value={phone}
                        onChange={
                          handlePhoneChange
                        }
                        maxLength={10}
                        placeholder="Enter 10-digit phone number"
                        disabled={saving}
                        className="w-full rounded-r-xl border border-[#dfcdbb] bg-white px-4 py-3.5 text-lg text-gray-800 outline-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20 disabled:opacity-60"
                      />

                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Enter your 10-digit mobile number.
                    </p>

                  </div>
                )}

                {/* BUTTONS */}

                <div className="mt-5 flex flex-col sm:flex-row gap-3">

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#6b2e0b] px-7 py-3.5 text-white font-bold hover:bg-[#4a1f0b] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Saving..."
                      : "💾 Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelEdit
                    }
                    disabled={saving}
                    className="rounded-xl bg-[#fff0df] px-7 py-3.5 text-[#6b2e0b] font-bold hover:bg-[#f6dfc9] transition disabled:opacity-60"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              /* =================================================
                 NORMAL VIEW
              ================================================= */

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* NAME */}

                <div className="bg-[#fff8ef] rounded-2xl p-5">

                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-800">
                    {user.name}
                  </p>

                </div>

                {/* EMAIL */}

                <div className="bg-[#fff8ef] rounded-2xl p-5">

                  <p className="text-sm text-gray-500">
                    Email Address
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-800 break-all">
                    {user.email}
                  </p>

                </div>

                {/* =================================================
                    PHONE - CUSTOMER ONLY
                ================================================= */}

                {!isAdmin && (
                  <div className="bg-[#fff8ef] rounded-2xl p-5">

                    <p className="text-sm text-gray-500">
                      Phone Number
                    </p>

                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      {user.phone
                        ? `+91 ${user.phone}`
                        : "Not provided"}
                    </p>

                  </div>
                )}

                {/* ACCOUNT TYPE */}

                <div className="bg-[#fff8ef] rounded-2xl p-5">

                  <p className="text-sm text-gray-500">
                    Account Type
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-800 capitalize">
                    {user.role ||
                      "Customer"}
                  </p>

                </div>

                {/* CUSTOMER ID */}

                <div className="bg-[#fff8ef] rounded-2xl p-5">

                  <p className="text-sm text-gray-500">
                    Customer ID
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-800">
                    #{user.id}
                  </p>

                </div>

              </div>

            )}

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <h3 className="text-2xl font-bold text-[#6b2e0b] mt-10">
              Quick Actions
            </h3>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* =================================================
                  MY ORDERS
                  CUSTOMER ONLY
              ================================================= */}

              {!isAdmin && (
                <Link
                  to="/orders"
                  className="rounded-2xl bg-[#fff0df] p-5 hover:bg-[#f6dfc9] transition"
                >

                  <div className="text-3xl">
                    📦
                  </div>

                  <h4 className="mt-3 font-bold text-[#6b2e0b]">
                    My Orders
                  </h4>

                  <p className="mt-1 text-sm text-gray-600">
                    View your orders
                  </p>

                </Link>
              )}

              {/* =================================================
                  WISHLIST
              ================================================= */}

              <Link
                to="/wishlist"
                className="rounded-2xl bg-[#fff0df] p-5 hover:bg-[#f6dfc9] transition"
              >

                <div className="text-3xl">
                  ❤️
                </div>

                <h4 className="mt-3 font-bold text-[#6b2e0b]">
                  Wishlist
                </h4>

                <p className="mt-1 text-sm text-gray-600">
                  View saved products
                </p>

              </Link>

              {/* =================================================
                  SHOP CHOCOLATES
              ================================================= */}

              <Link
                to="/products"
                className="rounded-2xl bg-[#fff0df] p-5 hover:bg-[#f6dfc9] transition"
              >

                <div className="text-3xl">
                  🍫
                </div>

                <h4 className="mt-3 font-bold text-[#6b2e0b]">
                  Shop Chocolates
                </h4>

                <p className="mt-1 text-sm text-gray-600">
                  Browse our products
                </p>

              </Link>

            </div>

            {/* =================================================
                LOGOUT
            ================================================= */}

            <div className="mt-10 pt-8 border-t border-[#f0dfce]">

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="w-full sm:w-auto rounded-xl bg-[#6b2e0b] px-8 py-3.5 text-white font-bold hover:bg-[#4a1f0b] transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;