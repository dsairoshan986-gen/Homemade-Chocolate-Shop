const jwt = require("jsonwebtoken");

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================
// Verifies the JWT token sent by the client.
// If valid, decoded user information is stored in:
// req.user
// =====================================================

const authMiddleware = (req, res, next) => {
  try {
    // ===================================================
    // GET AUTHORIZATION HEADER
    // ===================================================

    const authHeader = req.headers.authorization;

    // ===================================================
    // CHECK HEADER
    // ===================================================

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    // ===================================================
    // CHECK BEARER FORMAT
    // ===================================================

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // ===================================================
    // EXTRACT TOKEN
    // ===================================================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    // ===================================================
    // VERIFY JWT
    // ===================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ===================================================
    // STORE USER INFORMATION
    // ===================================================

    req.user = decoded;

    console.log(
      "Authenticated user:",
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }
    );

    // ===================================================
    // CONTINUE
    // ===================================================

    next();

  } catch (error) {
    console.error(
      "JWT Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;