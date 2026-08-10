// =====================================================
// ADMIN AUTHORIZATION MIDDLEWARE
// =====================================================
// This middleware must run AFTER authMiddleware.
//
// Flow:
//
// Request
//    ↓
// authMiddleware
//    ↓
// req.user
//    ↓
// adminMiddleware
//    ↓
// Check role
//    ↓
// Controller
// =====================================================

const adminMiddleware = (req, res, next) => {
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

    // ===================================================
    // CHECK ADMIN ROLE
    // ===================================================

    if (req.user.role !== "admin") {
      console.warn(
        "Unauthorized admin access attempt:",
        {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        }
      );

      return res.status(403).json({
        success: false,
        message:
          "Access denied. Admin privileges required.",
      });
    }

    // ===================================================
    // ADMIN VERIFIED
    // ===================================================

    console.log(
      "Admin authorization successful:",
      {
        id: req.user.id,
        email: req.user.email,
      }
    );

    // ===================================================
    // CONTINUE
    // ===================================================

    next();

  } catch (error) {
    console.error(
      "Admin Middleware Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

module.exports = adminMiddleware;