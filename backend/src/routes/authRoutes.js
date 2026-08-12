const express = require("express");

const router =
  express.Router();

const authController =
  require("../controllers/authController");

const authMiddleware =
  require("../middleware/authMiddleware");

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post(
  "/register",
  authController.register
);

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post(
  "/login",
  authController.login
);

// =====================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// =====================================================

router.put(
  "/profile",
  authMiddleware,
  authController.updateProfile
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;