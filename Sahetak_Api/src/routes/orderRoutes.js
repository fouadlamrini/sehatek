const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const {
  orderIdValidator,
  createOrderValidator,
  updateOrderStatusValidator,
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