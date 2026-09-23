const rateLimit = require("express-rate-limit");

// =========================
// GENERAL API LIMITER
// =========================

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_API) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later",
  },
});

// =========================
// AUTH LIMITER (login / refresh / profile)
// =========================

const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:
    process.env.NODE_ENV === "production"
      ? Number(process.env.RATE_LIMIT_MAX_AUTH) || 5
      : Number(process.env.RATE_LIMIT_MAX_AUTH_DEV) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts, please try again later",
  },
});

// =========================
// ORDER LIMITER (public order creation)
// =========================

const orderLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_ORDER) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many order requests, please try again later",
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  orderLimiter,
};