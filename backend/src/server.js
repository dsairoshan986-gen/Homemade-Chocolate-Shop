const app = require("./app");

// =====================================================
// SERVER CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5000;

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log("========================================");
  console.log("🍫 Homemade Chocolate Shop Backend");
  console.log("========================================");
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Orders API: http://localhost:${PORT}/api/orders`);
  console.log(
    `Admin Orders API: http://localhost:${PORT}/api/admin/orders`
  );
  console.log("========================================");
});