const db = require("../config/db");

// =====================================================
// CREATE ORDER
// POST /api/orders
// =====================================================

const createOrder = async (req, res) => {
  const client = await db.connect();

  try {
    // ===================================================
    // CHECK AUTHENTICATION
    // ===================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userEmail = req.user.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email not found in token",
      });
    }

    // ===================================================
    // GET REQUEST DATA
    // ===================================================

    const {
      customer_name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      total_amount,
      items,
    } = req.body;

    // ===================================================
    // VALIDATE CUSTOMER DETAILS
    // ===================================================

    if (
      !customer_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all customer details",
      });
    }

    // ===================================================
    // VALIDATE ITEMS
    // ===================================================

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }

    // ===================================================
    // START TRANSACTION
    // ===================================================

    await client.query("BEGIN");

    // ===================================================
    // CALCULATE TOTAL
    // ===================================================

    let calculatedTotal = 0;

    const validatedItems = [];

    // ===================================================
    // VALIDATE EACH PRODUCT
    // ===================================================

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      // -------------------------------------------------
      // VALIDATE PRODUCT ID
      // -------------------------------------------------

      if (!productId || productId <= 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      // -------------------------------------------------
      // VALIDATE QUANTITY
      // -------------------------------------------------

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      // -------------------------------------------------
      // GET PRODUCT
      // FOR UPDATE LOCKS THE PRODUCT ROW
      // -------------------------------------------------

      const productResult = await client.query(
        `
        SELECT
          id,
          name,
          price,
          stock
        FROM products
        WHERE id = $1
        FOR UPDATE
        `,
        [productId]
      );

      // -------------------------------------------------
      // PRODUCT NOT FOUND
      // -------------------------------------------------

      if (productResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          success: false,
          message: `Product ${productId} not found`,
        });
      }

      const product = productResult.rows[0];

      const currentStock = Number(product.stock);

      // -------------------------------------------------
      // CHECK STOCK BEFORE ORDER
      // -------------------------------------------------

      if (currentStock < quantity) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${currentStock} items available`,
        });
      }

      // -------------------------------------------------
      // USE DATABASE PRICE
      // NEVER TRUST FRONTEND PRICE
      // -------------------------------------------------

      const price = Number(product.price);

      const itemTotal = price * quantity;

      calculatedTotal += itemTotal;

      // -------------------------------------------------
      // STORE VALIDATED ITEM
      // -------------------------------------------------

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity,
        price,
      });
    }

    // ===================================================
    // ROUND TOTAL
    // ===================================================

    calculatedTotal =
      Math.round(calculatedTotal * 100) / 100;

    // ===================================================
    // CREATE ORDER
    // ===================================================

    const orderResult = await client.query(
      `
      INSERT INTO orders (
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total_amount,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      )
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
        calculatedTotal,
        "Pending",
      ]
    );

    const order = orderResult.rows[0];

    // ===================================================
    // CREATE ORDER ITEMS + REDUCE STOCK
    // ===================================================

    for (const item of validatedItems) {
      // -------------------------------------------------
      // INSERT ORDER ITEM
      // -------------------------------------------------

      await client.query(
        `
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES (
          $1,
          $2,
          $3,
          $4
        )
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
        ]
      );

      // -------------------------------------------------
      // SAFE STOCK UPDATE
      //
      // IMPORTANT:
      // Stock is reduced ONLY if enough stock exists.
      // This prevents negative stock.
      // -------------------------------------------------

      const stockUpdateResult =
        await client.query(
          `
          UPDATE products
          SET stock = stock - $1
          WHERE id = $2
            AND stock >= $1
          RETURNING
            id,
            name,
            stock
          `,
          [
            item.quantity,
            item.product_id,
          ]
        );

      // -------------------------------------------------
      // STOCK UPDATE FAILED
      // -------------------------------------------------

      if (stockUpdateResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message:
            "Insufficient stock for this product",
        });
      }

      console.log(
        `Stock updated: ${stockUpdateResult.rows[0].name} → ${stockUpdateResult.rows[0].stock}`
      );
    }

    // ===================================================
    // COMMIT TRANSACTION
    // =====================================================

    await client.query("COMMIT");

    // ===================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",

      data: {
        ...order,
        total_amount: calculatedTotal,
        items: validatedItems,
      },
    });
  } catch (error) {
    // ===================================================
    // ROLLBACK
    // ===================================================

    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Rollback Error:",
        rollbackError
      );
    }

    console.error(
      "Create Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  } finally {
    // ===================================================
    // RELEASE DATABASE CONNECTION
    // ===================================================

    client.release();
  }
};

// =====================================================
// GET MY ORDERS
// GET /api/orders
// =====================================================

const getOrders = async (req, res) => {
  try {
    // ===================================================
    // CHECK AUTHENTICATION
    // ===================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userEmail = req.user.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email not found in token",
      });
    }

    console.log(
      "Fetching orders for:",
      userEmail
    );

    // ===================================================
    // GET CUSTOMER ORDERS
    // ===================================================

    const ordersResult = await db.query(
      `
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
      WHERE LOWER(email) = LOWER($1)
      ORDER BY created_at DESC
      `,
      [userEmail]
    );

    const orders = [];

    // ===================================================
    // GET ORDER ITEMS
    // ===================================================

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

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get Orders Error:",
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
// GET ALL ORDERS - ADMIN
// GET /api/admin/orders
// =====================================================

const getAllOrders = async (req, res) => {
  try {
    console.log(
      "ADMIN: Fetching all orders..."
    );

    // ===================================================
    // GET ALL ORDERS
    // ===================================================

    const ordersResult = await db.query(
      `
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
      `
    );

    const orders = [];

    // ===================================================
    // GET ORDER ITEMS
    // ===================================================

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

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(
      "Get All Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS - ADMIN
// PUT /api/admin/orders/:id/status
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    // ===================================================
    // GET ORDER ID
    // ===================================================

    const orderId = Number(
      req.params.id
    );

    // ===================================================
    // GET STATUS
    // ===================================================

    const { status } = req.body;

    console.log(
      "ADMIN: Updating order:",
      orderId,
      "to:",
      status
    );

    // ===================================================
    // VALIDATE ORDER ID
    // ===================================================

    if (!orderId || orderId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // ===================================================
    // ALLOWED STATUSES
    // ===================================================

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    // ===================================================
    // VALIDATE STATUS
    // ===================================================

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed statuses: " +
          allowedStatuses.join(", "),
      });
    }

    // ===================================================
    // UPDATE ORDER STATUS
    // ===================================================

    const result = await db.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        status,
        orderId,
      ]
    );

    // ===================================================
    // ORDER NOT FOUND
    // ===================================================

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ===================================================
    // SUCCESS
    // ===================================================

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
};