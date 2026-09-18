const express = require("express");

const { calculate } = require("../controllers/pricingController");

const {
  calculatePriceValidator,
} = require("../validators/pricingValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Public route (used by the client cart)
router.post("/calculate", calculatePriceValidator, validate, calculate);

module.exports = router;