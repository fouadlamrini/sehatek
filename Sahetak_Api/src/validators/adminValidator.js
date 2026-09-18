const { body, param } = require("express-validator");

const createAdminValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name must not exceed 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters"),
];

const deleteAdminValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid admin id"),
];

module.exports = {
  createAdminValidator,
  deleteAdminValidator,
};
