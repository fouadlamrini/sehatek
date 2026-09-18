const { body, param } = require("express-validator");

const parseMealDays = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean);
    }
  }

  return value;
};

const validateMealDays = (value) => {
  const parsed = parseMealDays(value);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("mealDays must contain at least one day");
  }

  const allValid = parsed.every(
    (day) => typeof day === "string" && day.trim() !== ""
  );

  if (!allValid) {
    throw new Error("mealDays must contain valid day strings");
  }

  return true;
};

const productIdValidator = [
  param("id").isMongoId().withMessage("Invalid product id"),
];

const createProductValidator = [
  body("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Product image is required");
    }

    return true;
  }),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("mealDays")
    .custom(validateMealDays)
    .customSanitizer(parseMealDays),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),

  body("note")
    .optional()
    .isString()
    .withMessage("Note must be a string"),
];

const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("mealDays")
    .optional()
    .custom(validateMealDays)
    .customSanitizer(parseMealDays),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),

  body("note")
    .optional()
    .isString()
    .withMessage("Note must be a string"),
];

module.exports = {
  productIdValidator,
  createProductValidator,
  updateProductValidator,
};