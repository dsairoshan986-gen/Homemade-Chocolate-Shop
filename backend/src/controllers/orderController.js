const pool = require("../config/db");

// ========================================
// CREATE A NEW ORDER
// ========================================

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      customer_name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      total_amount,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (
      !customer_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All customer details and cart items are required",
      });
    }

    // ==============================
    // START TRANSACTION
    // ==============================

    await client.query("BEGIN");

    // ==============================
    // CREATE ORDER
    // ==============================

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total_amount
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total_amount,
      ]
    );

    const order = orderResult.rows[0];

    // ==============================
    // ADD ORDER ITEMS
    // ==============================

    for (const item of items) {
      await client.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES ($1,$2,$3,$4)
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
        ]
      );
    }

    // ==============================
    // COMMIT
    // ==============================

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });

  } finally {
    client.release();
  }
};


// ========================================
// GET MY ORDERS
// ========================================

const getMyOrders = async (req, res) => {
  try {

    // JWT middleware puts decoded user information here
    const userEmail = req.user.email;

    // Find orders belonging to logged-in user
    const result = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE email = $1
      ORDER BY created_at DESC
      `,
      [userEmail]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {

    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });

  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  createOrder,
  getMyOrders,
};