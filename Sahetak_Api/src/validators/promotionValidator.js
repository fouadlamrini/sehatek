const { body, param } = require("express-validator");

// =========================
// SANITIZE BOOLEAN
// =========================

const sanitizeBoolean = (value) => {
  if (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1" ||
    value === "on" ||
    value === "yes"
  ) {
    return true;
  }

  if (
    value === false ||
    value === "false" ||
    value === 0 ||
    value === "0" ||
    value === "off" ||
    value === "no"
  ) {
    return false;
  }

  return value;
};

// =========================
// VALUE VS TYPE
// =========================

// percentage must be between 0 and 100, fixed discount must be >= 0.
const validateValueForType = (value, { req }) => {
  if (Number(value) < 0) {
    throw new Error("Value must be a positive number");
  }

  if (req.body.type === "percentage" && Number(value) > 100) {
    throw new Error("Percentage value must not exceed 100");
  }

  return true;
};

// =========================
// PROMOTION ID VALIDATOR
// =========================

const promotionIdValidator = [
  param("id").isMongoId().withMessage("Invalid promotion id"),
];

// =========================
// CREATE PROMOTION VALIDATOR
// =========================

const createPromotionValidator = [
  body("product").isMongoId().withMessage("Valid product id is required"),

  body("type")
    .isIn(["percentage", "fixed"])
    .withMessage("Type must be percentage or fixed"),

  body("value")
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number")
    .custom(validateValueForType),

  body("active").optional().customSanitizer(sanitizeBoolean),
];

// =========================
// UPDATE PROMOTION VALIDATOR
// =========================

const updatePromotionValidator = [
  body("product").optional().isMongoId().withMessage("Valid product id is required"),

  body("type")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("Type must be percentage or fixed"),

  body("value")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number")
    .custom(validateValueForType),

  body("active").optional().customSanitizer(sanitizeBoolean),
];

module.exports = {
  promotionIdValidator,
  createPromotionValidator,
  updatePromotionValidator,
};