const express = require("express");

const router = express.Router();

const {
  register,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  deleteAccount
} = require("../controller/authController");

const protect = require("../middleware/authmiddleware");

const upload = require("../middleware/profileUpload");


// ========================================
// AUTH ROUTES
// ========================================

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


// ========================================
// GET CURRENT USER
// ========================================

router.get(
  "/me",
  protect,
  getMe
);


// ========================================
// UPDATE PROFILE
// ========================================

router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  updateProfile
);


// ========================================
// DELETE ACCOUNT
// ========================================

router.delete(
  "/delete-account",
  protect,
  deleteAccount
);


module.exports = router;