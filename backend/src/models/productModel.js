const db = require("../config/db");

const getAllProducts = async () => {
  const result = await db.query(
    "SELECT * FROM products ORDER BY id ASC"
  );

  return result.rows;
};

const getProductById = async (id) => {
  const result = await db.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
};