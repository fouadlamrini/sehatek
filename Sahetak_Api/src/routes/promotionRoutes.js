const express = require("express");

const {
  createPromotion,
  getPromotions,
  getPromotion,
  updatePromotion,
  deletePromotion,
} = require("../controllers/promotionController");

const {
  promotionIdValidator,
  createPromotionValidator,
  updatePromotionValidator,
} = require("../validators/promotionValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getPromotions);
router.get(
  "/:id",
  promotionIdValidator,
  validate,
  getPromotion
);

// Admin routes
router.post(
  "/",
  authMiddleware,
  createPromotionValidator,
  validate,
  createPromotion
);

router.patch(
  "/:id",
  authMiddleware,
  promotionIdValidator,
  updatePromotionValidator,
  validate,
  updatePromotion
);

router.delete(
  "/:id",
  authMiddleware,
  promotionIdValidator,
  validate,
  deletePromotion
);

module.exports = router;