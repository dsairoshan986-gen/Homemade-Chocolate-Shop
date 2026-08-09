const db = require("../config/db");


// =====================================================
// GET ALL PRODUCTS
// =====================================================

const getAllProducts = async () => {
  const result = await db.query(
    "SELECT * FROM products ORDER BY id ASC"
  );

  return result.rows;
};


// =====================================================
// GET PRODUCT BY ID
// =====================================================

const getProductById = async (id) => {
  const result = await db.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  return result.rows[0];
};


// =====================================================
// CREATE PRODUCT
// =====================================================

const createProduct = async ({
  name,
  description,
  price,
  category,
  image_url,
  stock,
  featured,
}) => {
  const result = await db.query(
    `
    INSERT INTO products
    (
      name,
      description,
      price,
      category,
      image_url,
      stock,
      featured
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      name,
      description,
      price,
      category,
      image_url,
      stock,
      featured,
    ]
  );

  return result.rows[0];
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

const updateProduct = async (
  id,
  {
    name,
    description,
    price,
    category,
    image_url,
    stock,
    featured,
  }
) => {
  const result = await db.query(
    `
    UPDATE products
    SET
      name = $1,
      description = $2,
      price = $3,
      category = $4,
      image_url = $5,
      stock = $6,
      featured = $7
    WHERE id = $8
    RETURNING *
    `,
    [
      name,
      description,
      price,
      category,
      image_url,
      stock,
      featured,
      id,
    ]
  );

  return result.rows[0];
};


// =====================================================
// DELETE PRODUCT
// =====================================================

const deleteProduct = async (id) => {
  const result = await db.query(
    `
    DELETE FROM products
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};