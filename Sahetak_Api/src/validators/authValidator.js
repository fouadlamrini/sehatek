const { body } = require("express-validator");

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must contain at least 6 characters"),
];

const changeNameValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name must not exceed 50 characters"),
];

const refreshTokenValidator = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required"),
];

module.exports = {
  loginValidator,
  changePasswordValidator,
  changeNameValidator,
  refreshTokenValidator,
};