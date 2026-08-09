const pool = require("../config/db");


// ==========================================
// CREATE A NEW ORDER
// ==========================================

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


    // ======================================
    // VALIDATION
    // ======================================

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


    // ======================================
    // START DATABASE TRANSACTION
    // ======================================

    await client.query("BEGIN");


    // ======================================
    // CREATE ORDER
    // ======================================

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


    // ======================================
    // ADD ORDER ITEMS
    // ======================================

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


    // ======================================
    // COMMIT TRANSACTION
    // ======================================

    await client.query("COMMIT");


    // ======================================
    // RESPONSE
    // ======================================

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });

  } catch (error) {

    // ======================================
    // ROLLBACK IF ERROR
    // ======================================

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



// ==========================================
// GET ALL ORDERS FOR LOGGED-IN USER
// ==========================================

const getOrders = async (req, res) => {

  try {

    // Get email from JWT
    const userEmail = req.user.email;


    // ======================================
    // FETCH ORDERS + ORDER ITEMS + PRODUCTS
    // ======================================

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.customer_name,
        o.email,
        o.phone,
        o.address,
        o.city,
        o.state,
        o.pincode,
        o.total_amount,
        o.status,
        o.created_at,

        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'product_name', p.name
            )
            ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items

      FROM orders o

      LEFT JOIN order_items oi
        ON o.id = oi.order_id

      LEFT JOIN products p
        ON oi.product_id = p.id

      WHERE o.email = $1

      GROUP BY
        o.id,
        o.customer_name,
        o.email,
        o.phone,
        o.address,
        o.city,
        o.state,
        o.pincode,
        o.total_amount,
        o.status,
        o.created_at

      ORDER BY o.created_at DESC
      `,
      [userEmail]
    );


    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {

    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });

  }
};



// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createOrder,
  getOrders,
};