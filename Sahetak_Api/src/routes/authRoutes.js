const express = require("express");

const {
  login,
  changePassword,
  changeName,
  getProfile,
  logout,
  refresh,
} = require("../controllers/authController");

const {
  loginValidator,
  changePasswordValidator,
  changeNameValidator,
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// Public
router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/refresh", authLimiter, refresh);

// Protected
router.patch(
  "/change-password",
  authMiddleware,
  changePasswordValidator,
  validate,
  changePassword
);

router.patch(
  "/change-name",
  authMiddleware,
  changeNameValidator,
  validate,
  changeName
);

// Profile
router.get("/me", authMiddleware, getProfile);

router.post("/logout", authMiddleware, logout);

module.exports = router;