const pool = require("../config/db");

// Create a new order
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

    // Basic validation
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

    await client.query("BEGIN");

    // Create order
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

    // Add order items
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

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createOrder,
};