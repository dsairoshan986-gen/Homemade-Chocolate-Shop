const db = require("../config/db");

// =====================================================
// GET ALL ORDERS
// GET /api/admin/orders
// =====================================================

const getAllOrders = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN: Fetching all orders...");
    console.log("=================================");

    const ordersResult = await db.query(`
      SELECT
        id,
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total_amount,
        status,
        created_at
      FROM orders
      ORDER BY created_at DESC
    `);

    const orders = [];

    // ================================================
    // GET ITEMS FOR EACH ORDER
    // ================================================

    for (const order of ordersResult.rows) {
      const itemsResult = await db.query(
        `
        SELECT
          oi.id,
          oi.order_id,
          oi.product_id,
          oi.quantity,
          oi.price,
          p.name AS product_name
        FROM order_items oi
        LEFT JOIN products p
          ON p.id = oi.product_id
        WHERE oi.order_id = $1
        ORDER BY oi.id ASC
        `,
        [order.id]
      );

      orders.push({
        ...order,
        items: itemsResult.rows,
      });
    }

    console.log(
      `ADMIN: Found ${orders.length} orders`
    );

    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error(
      "ADMIN GET ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id/status
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    const { status } = req.body;

    console.log(
      `ADMIN: Updating order ${orderId} to ${status}`
    );

    // ================================================
    // VALIDATE ORDER ID
    // ================================================

    if (!orderId || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // ================================================
    // VALIDATE STATUS
    // ================================================

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled",
      });
    }

    // ================================================
    // CHECK ORDER EXISTS
    // ================================================

    const existingOrder = await db.query(
      `
      SELECT id
      FROM orders
      WHERE id = $1
      `,
      [orderId]
    );

    if (existingOrder.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ================================================
    // UPDATE STATUS
    // ================================================

    const result = await db.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, orderId]
    );

    console.log(
      `ADMIN: Order ${orderId} updated successfully`
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(
      "ADMIN UPDATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllOrders,
  updateOrderStatus,
};