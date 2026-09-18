const { body } = require("express-validator");

const calculatePriceValidator = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("productIds must contain at least one product"),

  body("productIds.*")
    .isMongoId()
    .withMessage("Each product id must be a valid id"),
];

module.exports = {
  calculatePriceValidator,
};