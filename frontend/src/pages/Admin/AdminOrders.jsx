import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../../config/api";

// =====================================================
// ADMIN ORDERS
// =====================================================

function AdminOrders() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  // =====================================================
  // CHECK ADMIN
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    let user = null;

    try {
      user = JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      user = null;
    }

    if (!token || !user) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    if (user.role !== "admin") {
      navigate("/", {
        replace: true,
      });

      return;
    }

    fetchOrders();
  }, [navigate]);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(
        `${API_URL}/admin/orders?t=${Date.now()}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result =
        await response.json();

      console.log(
        "ADMIN ORDERS RESPONSE:",
        result
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (response.status === 403) {
        navigate("/", {
          replace: true,
        });

        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to fetch orders."
        );
      }

      setOrders(
        Array.isArray(result.data)
          ? result.data
          : []
      );

    } catch (err) {
      console.error(
        "Admin Orders Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // NORMALIZE STATUS
  // =====================================================

  const getStatus = (order) => {
    return (
      order.status ||
      order.order_status ||
      "pending"
    ).toLowerCase();
  };

  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";

      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";

      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";

      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";

      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";

      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // CUSTOMER NAME
  // =====================================================

  const getCustomerName = (order) => {
    return (
      order.customer_name ||
      order.user_name ||
      order.name ||
      order.customer?.name ||
      order.user?.name ||
      "Customer"
    );
  };

  // =====================================================
  // CUSTOMER EMAIL
  // =====================================================

  const getCustomerEmail = (order) => {
    return (
      order.customer_email ||
      order.user_email ||
      order.email ||
      order.customer?.email ||
      order.user?.email ||
      "No email"
    );
  };

  // =====================================================
  // ORDER TOTAL
  // =====================================================

  const getOrderTotal = (order) => {
    const total =
      order.total_amount ??
      order.total ??
      order.grand_total ??
      order.amount ??
      0;

    return Number(total) || 0;
  };

  // =====================================================
  // ORDER ID
  // =====================================================

  const getOrderId = (order) => {
    return (
      order.id ||
      order.order_id ||
      "—"
    );
  };

  // =====================================================
  // ORDER ITEMS
  // =====================================================

  const getOrderItems = (order) => {
    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (Array.isArray(order.order_items)) {
      return order.order_items;
    }

    return [];
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status =
        getStatus(order);

      const customerName =
        getCustomerName(order);

      const customerEmail =
        getCustomerEmail(order);

      const orderId =
        String(getOrderId(order));

      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        customerName
          .toLowerCase()
          .includes(searchValue) ||
        customerEmail
          .toLowerCase()
          .includes(searchValue) ||
        orderId
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const totalOrders =
      orders.length;

    const pendingOrders =
      orders.filter(
        (order) =>
          getStatus(order) ===
          "pending"
      ).length;

    const processingOrders =
      orders.filter(
        (order) =>
          getStatus(order) ===
          "processing"
      ).length;

    const deliveredOrders =
      orders.filter(
        (order) =>
          getStatus(order) ===
          "delivered"
      ).length;

    const revenue =
      orders.reduce(
        (sum, order) =>
          sum + getOrderTotal(order),
        0
      );

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      revenue,
    };
  }, [orders]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#fff8ef] via-[#f8eadb] to-[#efd2b3] flex items-center justify-center px-6">

        <div className="text-center">

          <div className="mx-auto w-14 h-14 rounded-full border-4 border-[#e8c9aa] border-t-[#8b3e12] animate-spin" />

          <h2 className="mt-6 text-2xl font-bold text-[#5a270b]">
            Loading orders...
          </h2>

          <p className="mt-2 text-[#795548]">
            Please wait while we fetch your orders.
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#fff8ef] via-[#f8eadb] to-[#efd2b3] flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-10 max-w-md w-full text-center">

          <div className="text-6xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#6b2e0b]">
            Unable to load orders
          </h1>

          <p className="mt-4 text-gray-600">
            {error}
          </p>

          <button
            onClick={() =>
              fetchOrders()
            }
            className="mt-7 bg-gradient-to-r from-[#8b3e12] to-[#c45a0a] text-white px-7 py-3 rounded-xl font-bold hover:shadow-lg transition"
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff8ef] via-[#f8eadb] to-[#efd2b3] px-4 sm:px-6 py-10">

      {/* =================================================
          DECORATIVE BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#d8a477]/20 blur-3xl" />

        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-[#b8794b]/15 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-[#e8b98f]/25 blur-3xl" />

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm border border-[#ead5c0]">

              <span>
                📦
              </span>

              <span className="font-semibold text-[#7a3414]">
                Order Management
              </span>

            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold text-[#5a270b] tracking-tight">
              Manage Orders
            </h1>

            <p className="mt-3 text-[#795548] text-lg">
              View and manage customer orders from your Chocolate Shop.
            </p>

          </div>

          {/* REFRESH */}

          <button
            onClick={() =>
              fetchOrders(true)
            }
            disabled={refreshing}
            className="self-start lg:self-auto inline-flex items-center gap-2 bg-white border border-[#dfc5ad] text-[#7a3414] px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-[#fff8ef] hover:shadow-md transition disabled:opacity-60"
          >

            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              🔄
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh Orders"}

          </button>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-10">

          {/* TOTAL */}

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#ead5c0] shadow-md p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#5a270b]">
                  {statistics.totalOrders}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#fff0df] flex items-center justify-center text-2xl">
                📦
              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="bg-white/95 rounded-2xl border border-[#ead5c0] shadow-md p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-extrabold text-amber-700">
                  {statistics.pendingOrders}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
                ⏳
              </div>

            </div>

          </div>

          {/* PROCESSING */}

          <div className="bg-white/95 rounded-2xl border border-[#ead5c0] shadow-md p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Processing
                </p>

                <p className="mt-2 text-3xl font-extrabold text-purple-700">
                  {statistics.processingOrders}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
                ⚙️
              </div>

            </div>

          </div>

          {/* DELIVERED */}

          <div className="bg-white/95 rounded-2xl border border-[#ead5c0] shadow-md p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Delivered
                </p>

                <p className="mt-2 text-3xl font-extrabold text-green-700">
                  {statistics.deliveredOrders}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                ✅
              </div>

            </div>

          </div>

          {/* REVENUE */}

          <div className="bg-gradient-to-br from-[#6b2e0b] to-[#a84d12] rounded-2xl shadow-lg p-5 text-white">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-white/80">
                  Revenue
                </p>

                <p className="mt-2 text-2xl font-extrabold">
                  ₹{statistics.revenue.toFixed(2)}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
                💰
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mt-10 bg-white/95 backdrop-blur-sm rounded-2xl border border-[#ead5c0] shadow-md p-5">

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">

            {/* SEARCH */}

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by order ID, customer name or email..."
                className="w-full rounded-xl border border-[#dfcdbb] bg-[#fffaf5] px-12 py-3.5 text-gray-800 outline-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20"
              />

            </div>

            {/* FILTER */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-[#dfcdbb] bg-[#fffaf5] px-5 py-3.5 text-gray-800 font-semibold outline-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20"
            >

              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="shipped">
                Shipped
              </option>

              <option value="delivered">
                Delivered
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-[#7a3414]">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[#7a3414]">
              {orders.length}
            </span>{" "}
            orders
          </div>

        </div>

        {/* =================================================
            ORDERS
        ================================================= */}

        <div className="mt-8">

          {filteredOrders.length === 0 ? (

            <div className="bg-white/95 rounded-3xl border border-[#ead5c0] shadow-lg p-16 text-center">

              <div className="text-7xl">
                📦
              </div>

              <h2 className="mt-6 text-3xl font-bold text-[#5a270b]">
                No Orders Found
              </h2>

              <p className="mt-3 text-gray-600">
                {orders.length === 0
                  ? "There are no customer orders yet."
                  : "Try changing your search or status filter."}
              </p>

            </div>

          ) : (

            <div className="bg-white/95 rounded-3xl border border-[#ead5c0] shadow-xl overflow-hidden">

              {/* DESKTOP TABLE */}

              <div className="hidden lg:block overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="bg-gradient-to-r from-[#6b2e0b] to-[#8b3e12] text-white">

                      <th className="text-left px-6 py-5 text-sm font-bold">
                        Order
                      </th>

                      <th className="text-left px-6 py-5 text-sm font-bold">
                        Customer
                      </th>

                      <th className="text-left px-6 py-5 text-sm font-bold">
                        Items
                      </th>

                      <th className="text-left px-6 py-5 text-sm font-bold">
                        Total
                      </th>

                      <th className="text-left px-6 py-5 text-sm font-bold">
                        Date
                      </th>

                      <th className="text-left px-6 py-5 text-sm font-bold">
                        Status
                      </th>

                      <th className="text-left px-6 py-5 text-sm font-bold">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredOrders.map(
                      (order) => {

                        const status =
                          getStatus(order);

                        const items =
                          getOrderItems(order);

                        return (
                          <tr
                            key={getOrderId(
                              order
                            )}
                            className="border-b border-[#f0dfce] hover:bg-[#fffaf5] transition"
                          >

                            {/* ORDER */}

                            <td className="px-6 py-5">

                              <p className="font-bold text-[#6b2e0b]">
                                #{getOrderId(
                                  order
                                )}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                Order
                              </p>

                            </td>

                            {/* CUSTOMER */}

                            <td className="px-6 py-5">

                              <p className="font-semibold text-gray-800">
                                {getCustomerName(
                                  order
                                )}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                {getCustomerEmail(
                                  order
                                )}
                              </p>

                            </td>

                            {/* ITEMS */}

                            <td className="px-6 py-5">

                              {items.length > 0 ? (

                                <div>

                                  <p className="font-semibold text-gray-700">
                                    {items.length}{" "}
                                    {items.length ===
                                    1
                                      ? "item"
                                      : "items"}
                                  </p>

                                  <p className="text-sm text-gray-500 mt-1 max-w-[180px] truncate">
                                    {items
                                      .map(
                                        (item) =>
                                          item.name ||
                                          item.product_name ||
                                          "Product"
                                      )
                                      .join(
                                        ", "
                                      )}
                                  </p>

                                </div>

                              ) : (

                                <span className="text-gray-500">
                                  —
                                </span>

                              )}

                            </td>

                            {/* TOTAL */}

                            <td className="px-6 py-5">

                              <p className="font-extrabold text-[#b84d00]">
                                ₹
                                {getOrderTotal(
                                  order
                                ).toFixed(2)}
                              </p>

                            </td>

                            {/* DATE */}

                            <td className="px-6 py-5">

                              <p className="text-gray-700 font-medium">
                                {formatDate(
                                  order.created_at ||
                                  order.createdAt ||
                                  order.date
                                )}
                              </p>

                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-bold capitalize ${getStatusClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>

                            </td>

                            {/* ACTION */}

                            <td className="px-6 py-5">

                              <button
                                onClick={() =>
                                  setSelectedOrder(
                                    order
                                  )
                                }
                                className="px-4 py-2 rounded-lg bg-[#fff0df] text-[#8b3e12] font-bold hover:bg-[#f5dec8] transition"
                              >
                                View
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

              {/* MOBILE CARDS */}

              <div className="lg:hidden divide-y divide-[#f0dfce]">

                {filteredOrders.map(
                  (order) => {

                    const status =
                      getStatus(order);

                    const items =
                      getOrderItems(order);

                    return (
                      <div
                        key={getOrderId(
                          order
                        )}
                        className="p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <p className="font-extrabold text-[#6b2e0b]">
                              #
                              {getOrderId(
                                order
                              )}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(
                                order.created_at ||
                                order.createdAt ||
                                order.date
                              )}
                            </p>

                          </div>

                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-bold capitalize ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </div>

                        <div className="mt-5">

                          <p className="font-bold text-gray-800">
                            {getCustomerName(
                              order
                            )}
                          </p>

                          <p className="text-sm text-gray-500">
                            {getCustomerEmail(
                              order
                            )}
                          </p>

                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4">

                          <div>
                            <p className="text-xs text-gray-500">
                              Items
                            </p>

                            <p className="font-semibold mt-1">
                              {items.length}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Total
                            </p>

                            <p className="font-extrabold text-[#b84d00] mt-1">
                              ₹
                              {getOrderTotal(
                                order
                              ).toFixed(2)}
                            </p>
                          </div>

                        </div>

                        <button
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          className="w-full mt-5 bg-[#fff0df] text-[#8b3e12] py-3 rounded-xl font-bold hover:bg-[#f5dec8] transition"
                        >
                          View Order Details
                        </button>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="bg-gradient-to-r from-[#6b2e0b] to-[#a84d12] text-white px-6 py-5 flex items-center justify-between">

              <div>

                <p className="text-sm text-white/70">
                  Order Details
                </p>

                <h2 className="text-2xl font-extrabold">
                  #{getOrderId(
                    selectedOrder
                  )}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-xl"
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="p-6">

              {/* CUSTOMER */}

              <div className="bg-[#fff8ef] rounded-2xl p-5 border border-[#ead5c0]">

                <h3 className="font-bold text-[#6b2e0b] text-lg">
                  Customer Information
                </h3>

                <div className="mt-4 space-y-2 text-gray-700">

                  <p>
                    <span className="font-semibold">
                      Name:
                    </span>{" "}
                    {getCustomerName(
                      selectedOrder
                    )}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Email:
                    </span>{" "}
                    {getCustomerEmail(
                      selectedOrder
                    )}
                  </p>

                  {selectedOrder.phone && (
                    <p>
                      <span className="font-semibold">
                        Phone:
                      </span>{" "}
                      {selectedOrder.phone}
                    </p>
                  )}

                </div>

              </div>

              {/* ORDER INFO */}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="rounded-2xl border border-[#ead5c0] p-5">

                  <p className="text-sm text-gray-500">
                    Order Date
                  </p>

                  <p className="mt-2 font-bold text-[#6b2e0b]">
                    {formatDateTime(
                      selectedOrder.created_at ||
                      selectedOrder.createdAt ||
                      selectedOrder.date
                    )}
                  </p>

                </div>

                <div className="rounded-2xl border border-[#ead5c0] p-5">

                  <p className="text-sm text-gray-500">
                    Order Total
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-[#b84d00]">
                    ₹
                    {getOrderTotal(
                      selectedOrder
                    ).toFixed(2)}
                  </p>

                </div>

              </div>

              {/* ITEMS */}

              <div className="mt-6">

                <h3 className="text-lg font-bold text-[#6b2e0b]">
                  Order Items
                </h3>

                <div className="mt-3 rounded-2xl border border-[#ead5c0] overflow-hidden">

                  {getOrderItems(
                    selectedOrder
                  ).length > 0 ? (

                    getOrderItems(
                      selectedOrder
                    ).map(
                      (item, index) => {

                        const name =
                          item.name ||
                          item.product_name ||
                          "Product";

                        const quantity =
                          Number(
                            item.quantity
                          ) || 1;

                        const price =
                          Number(
                            item.price ||
                            item.unit_price ||
                            0
                          );

                        return (
                          <div
                            key={
                              item.id ||
                              index
                            }
                            className="flex items-center justify-between gap-4 px-5 py-4 border-b last:border-b-0 border-[#f0dfce]"
                          >

                            <div>

                              <p className="font-bold text-gray-800">
                                {name}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                Quantity:{" "}
                                {quantity}
                              </p>

                            </div>

                            <p className="font-bold text-[#b84d00]">
                              ₹
                              {(
                                price *
                                quantity
                              ).toFixed(2)}
                            </p>

                          </div>
                        );
                      }
                    )

                  ) : (

                    <p className="p-5 text-gray-500">
                      No item details available.
                    </p>

                  )}

                </div>

              </div>

              {/* SHIPPING ADDRESS */}

              {(selectedOrder.address ||
                selectedOrder.shipping_address) && (

                <div className="mt-6 bg-[#fff8ef] rounded-2xl p-5 border border-[#ead5c0]">

                  <h3 className="font-bold text-[#6b2e0b] text-lg">
                    📍 Shipping Address
                  </h3>

                  <p className="mt-3 text-gray-700 leading-relaxed">
                    {selectedOrder.address ||
                      selectedOrder.shipping_address}
                  </p>

                </div>

              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="px-6 py-5 bg-[#fffaf5] border-t border-[#ead5c0] flex justify-end">

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="px-6 py-3 rounded-xl bg-[#6b2e0b] text-white font-bold hover:bg-[#4d2008] transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminOrders;