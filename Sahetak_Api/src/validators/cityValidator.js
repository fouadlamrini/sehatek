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
// CITY ID VALIDATOR
// =========================

const cityIdValidator = [
  param("id").isMongoId().withMessage("Invalid city id"),
];

// =========================
// CREATE CITY VALIDATOR
// =========================

const createCityValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("City name is required")
    .isLength({ max: 60 })
    .withMessage("City name is too long"),

  body("active").optional().customSanitizer(sanitizeBoolean),
];

// =========================
// UPDATE CITY VALIDATOR
// =========================

const updateCityValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City name is required")
    .isLength({ max: 60 })
    .withMessage("City name is too long"),

  body("active").optional().customSanitizer(sanitizeBoolean),
];

module.exports = {
  cityIdValidator,
  createCityValidator,
  updateCityValidator,
};
