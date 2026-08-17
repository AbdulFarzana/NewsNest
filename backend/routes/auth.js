const express = require("express");

const router = express.Router();

const {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require("../controller/authController");

const protect =
  require("../middleware/authmiddleware");

// ==========================================
// AUTH ROUTES
// ==========================================

router.post(
  "/register",
  register
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/login",
  login
);

router.post(
  "/logout",
  logout
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

// ==========================================
// CURRENT LOGGED-IN USER
// ==========================================

router.get(
  "/me",
  protect,
  async (req, res) => {
    return res.status(200).json({
      success: true,

      user: {
        id:
          req.user._id,

        name:
          req.user.name,

        email:
          req.user.email,

        role:
          req.user.role,

        avatar:
          req.user.avatar,

        avatarUrl:
          req.user.avatarUrl
      }
    });
  }
);

module.exports = router;