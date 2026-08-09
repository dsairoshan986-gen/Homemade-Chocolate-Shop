const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");


// =====================================================
// REGISTER
// =====================================================

router.post(
  "/register",
  authController.register
);


// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  authController.login
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;