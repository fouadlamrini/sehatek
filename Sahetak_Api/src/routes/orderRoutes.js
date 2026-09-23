const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getGuestOrder,
  cancelGuestOrder,
  updateGuestOrder,
} = require("../controllers/orderController");

const {
  orderIdValidator,
  createOrderValidator,
  updateOrderStatusValidator,
  guestTrackValidator,
  guestCancelValidator,
  guestUpdateValidator,
} = require("../validators/orderValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { orderLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// =========================
// CUSTOMER
// =========================

router.post(
  "/",
  orderLimiter,
  createOrderValidator,
  validate,
  createOrder
);

// =========================
// GUEST TRACKING (public)
// =========================

router.post(
  "/track",
  orderLimiter,
  guestTrackValidator,
  validate,
  getGuestOrder
);

router.patch(
  "/track/cancel",
  orderLimiter,
  guestCancelValidator,
  validate,
  cancelGuestOrder
);

router.patch(
  "/track/update",
  orderLimiter,
  guestUpdateValidator,
  validate,
  updateGuestOrder
);

// =========================
// ADMIN
// =========================

router.get("/", authMiddleware, getOrders);

router.get(
  "/:id",
  authMiddleware,
  orderIdValidator,
  validate,
  getOrder
);

router.patch(
  "/:id/status",
  authMiddleware,
  orderIdValidator,
  updateOrderStatusValidator,
  validate,
  updateOrderStatus
);

router.delete(
  "/:id",
  authMiddleware,
  orderIdValidator,
  validate,
  deleteOrder
);

module.exports = router;