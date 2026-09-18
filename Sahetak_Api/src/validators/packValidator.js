const mongoose = require("mongoose");

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
// VALIDATE PRODUCTS ARRAY
// =========================

// Non-empty, every id a valid ObjectId, no duplicates inside the Pack.
const validateProducts = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Pack must contain at least one product");
  }

  if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
    throw new Error("Each product must have a valid id");
  }

  if (new Set(value.map(String)).size !== value.length) {
    throw new Error("Pack cannot contain duplicate products");
  }

  return true;
};

// =========================
// VALUE VS TYPE
// =========================

// percentage must be between 0 and 100; price/fixed amounts must be >= 0.
const validateValueForType = (value, { req }) => {
  if (req.body.type === "percentage" && Number(value) > 100) {
    throw new Error("Percentage value must not exceed 100");
  }

  return true;
};

// =========================
// PACK ID VALIDATOR
// =========================

const packIdValidator = [
  param("id").isMongoId().withMessage("Invalid pack id"),
];

// =========================
// CREATE PACK VALIDATOR
// =========================

const createPackValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("products").custom(validateProducts),

  body("type")
    .isIn(["price", "fixed", "percentage"])
    .withMessage("Type must be price, fixed or percentage"),

  body("value")
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number")
    .custom(validateValueForType),

  body("active").optional().customSanitizer(sanitizeBoolean),
];

// =========================
// UPDATE PACK VALIDATOR
// =========================

const updatePackValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("products").optional().custom(validateProducts),

  body("type")
    .optional()
    .isIn(["price", "fixed", "percentage"])
    .withMessage("Type must be price, fixed or percentage"),

  body("value")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number")
    .custom(validateValueForType),

  body("active").optional().customSanitizer(sanitizeBoolean),
];

module.exports = {
  packIdValidator,
  createPackValidator,
  updatePackValidator,
};