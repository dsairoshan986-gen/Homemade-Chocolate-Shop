const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // =================================================
    // VALIDATE REQUIRED INPUT
    // =================================================

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone number and password are required",
      });
    }

    // =================================================
    // CLEAN INPUT
    // =================================================

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPhone =
      phone.trim();

    // =================================================
    // VALIDATE NAME
    // =================================================

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters",
      });
    }

    // =================================================
    // VALIDATE EMAIL
    // =================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address",
      });
    }

    // =================================================
    // VALIDATE PHONE
    // =================================================

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid 10-digit Indian phone number",
      });
    }

    // =================================================
    // VALIDATE PASSWORD
    // =================================================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    // =================================================
    // CHECK EMAIL
    // =================================================

    const existingUser =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE LOWER(email) = LOWER($1)
        `,
        [cleanEmail]
      );

    if (
      existingUser.rows.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "User with this email already exists",
      });
    }

    // =================================================
    // CHECK PHONE
    // =================================================

    const existingPhone =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE phone = $1
        `,
        [cleanPhone]
      );

    if (
      existingPhone.rows.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "User with this phone number already exists",
      });
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // =================================================
    // CREATE CUSTOMER
    // =================================================

    const result =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          phone,
          password,
          role
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5
        )
        RETURNING
          id,
          name,
          email,
          phone,
          role,
          created_at
        `,
        [
          cleanName,
          cleanEmail,
          cleanPhone,
          hashedPassword,
          "customer",
        ]
      );

    const user =
      result.rows[0];

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message:
        "Registration successful",
      data: user,
    });

  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Registration failed",
      error:
        error.message,
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // =================================================
    // VALIDATE INPUT
    // =================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // =================================================
    // FIND USER
    // =================================================

    const result =
      await pool.query(
        `
        SELECT
          id,
          name,
          email,
          phone,
          password,
          role
        FROM users
        WHERE LOWER(email) = LOWER($1)
        `,
        [email.trim()]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const user =
      result.rows[0];

    // =================================================
    // CHECK PASSWORD
    // =================================================

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // =================================================
    // CREATE JWT
    // =================================================

    const token =
      jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    // =================================================
    // REMOVE PASSWORD
    // =================================================

    delete user.password;

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Login successful",
      token,
      user,
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed",
      error:
        error.message,
    });
  }
};

// =====================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// =====================================================

const updateProfile = async (
  req,
  res
) => {
  try {
    // =================================================
    // AUTHENTICATION
    // =================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const userId =
      Number(req.user.id);

    if (!userId || userId <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user ID",
      });
    }

    // =================================================
    // REQUEST DATA
    // =================================================

    const {
      name,
      phone,
    } = req.body;

    // =================================================
    // GET CURRENT USER
    // =================================================

    const currentResult =
      await pool.query(
        `
        SELECT
          id,
          name,
          email,
          phone,
          role
        FROM users
        WHERE id = $1
        `,
        [userId]
      );

    if (
      currentResult.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const currentUser =
      currentResult.rows[0];

    // =================================================
    // VALIDATE NAME
    // =================================================

    if (
      !name ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name is required",
      });
    }

    const cleanName =
      name.trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters",
      });
    }

    // =================================================
    // ADMIN
    //
    // Admin can change name.
    // Admin does NOT need phone.
    // =================================================

    if (
      currentUser.role === "admin"
    ) {
      const updatedResult =
        await pool.query(
          `
          UPDATE users
          SET name = $1
          WHERE id = $2
          RETURNING
            id,
            name,
            email,
            phone,
            role
          `,
          [
            cleanName,
            userId,
          ]
        );

      const updatedUser =
        updatedResult.rows[0];

      const token =
        jwt.sign(
          {
            id:
              updatedUser.id,

            name:
              updatedUser.name,

            email:
              updatedUser.email,

            phone:
              updatedUser.phone,

            role:
              updatedUser.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      return res.status(200).json({
        success: true,
        message:
          "Profile updated successfully",
        user: updatedUser,
        token,
      });
    }

    // =================================================
    // CUSTOMER
    //
    // Customer must have phone.
    // =================================================

    if (
      !phone ||
      !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number is required",
      });
    }

    const cleanPhone =
      phone.trim();

    // =================================================
    // VALIDATE PHONE
    // =================================================

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid 10-digit Indian phone number",
      });
    }

    // =================================================
    // CHECK DUPLICATE PHONE
    // =================================================

    const phoneResult =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE phone = $1
          AND id != $2
        `,
        [
          cleanPhone,
          userId,
        ]
      );

    if (
      phoneResult.rows.length > 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This phone number is already registered",
      });
    }

    // =================================================
    // UPDATE CUSTOMER
    // =================================================

    const updatedResult =
      await pool.query(
        `
        UPDATE users
        SET
          name = $1,
          phone = $2
        WHERE id = $3
        RETURNING
          id,
          name,
          email,
          phone,
          role
        `,
        [
          cleanName,
          cleanPhone,
          userId,
        ]
      );

    const updatedUser =
      updatedResult.rows[0];

    // =================================================
    // CREATE NEW JWT
    // =================================================

    const token =
      jwt.sign(
        {
          id:
            updatedUser.id,

          name:
            updatedUser.name,

          email:
            updatedUser.email,

          phone:
            updatedUser.phone,

          role:
            updatedUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user: updatedUser,
      token,
    });

  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
      error:
        error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  register,
  login,
  updateProfile,
};