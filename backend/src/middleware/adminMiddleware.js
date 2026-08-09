const adminMiddleware = (req, res, next) => {
  try {
    // Make sure the user has been authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check whether the logged-in user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // User is an admin
    next();

  } catch (error) {
    console.error("Admin Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

module.exports = adminMiddleware;