import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to load user:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
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

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <main className="min-h-screen bg-[#fff8ef] py-12 px-6">

      <div className="max-w-5xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm">
            <span>🍫</span>

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
            PROFILE CARD
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-xl border border-[#f0dfce] overflow-hidden">

          {/* PROFILE HEADER */}

          <div className="bg-[#6b2e0b] px-8 py-10 text-white">

            <div className="flex flex-col sm:flex-row items-center gap-6">

              {/* AVATAR */}

              <div className="w-28 h-28 rounded-full bg-[#fff0df] text-[#6b2e0b] flex items-center justify-center text-4xl font-extrabold shadow-lg">
                {initials}
              </div>

              {/* USER NAME */}

              <div className="text-center sm:text-left">

                <h2 className="text-3xl font-bold">
                  {user.name}
                </h2>

                <p className="mt-2 text-[#f8dfc5]">
                  {user.email}
                </p>

                <span className="inline-block mt-3 bg-[#b84d00] px-4 py-1.5 rounded-full text-sm font-semibold capitalize">
                  {user.role || "customer"}
                </span>

              </div>

            </div>

          </div>

          {/* PROFILE INFORMATION */}

          <div className="p-8">

            <h3 className="text-2xl font-bold text-[#6b2e0b]">
              Account Information
            </h3>

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

              {/* ROLE */}

              <div className="bg-[#fff8ef] rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Account Type
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-800 capitalize">
                  {user.role || "Customer"}
                </p>

              </div>

              {/* USER ID */}

              <div className="bg-[#fff8ef] rounded-2xl p-5">

                <p className="text-sm text-gray-500">
                  Customer ID
                </p>

                <p className="mt-2 text-lg font-semibold text-gray-800">
                  #{user.id}
                </p>

              </div>

            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <h3 className="text-2xl font-bold text-[#6b2e0b] mt-10">
              Quick Actions
            </h3>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

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
                onClick={handleLogout}
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