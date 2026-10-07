const express = require("express");

const {
  createCity,
  getCities,
  getCity,
  updateCity,
  deleteCity,
} = require("../controllers/cityController");

const {
  cityIdValidator,
  createCityValidator,
  updateCityValidator,
} = require("../validators/cityValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getCities);

router.get(
  "/:id",
  cityIdValidator,
  validate,
  getCity
);

// Admin routes
router.post(
  "/",
  authMiddleware,
  createCityValidator,
  validate,
  createCity
);

router.patch(
  "/:id",
  authMiddleware,
  cityIdValidator,
  updateCityValidator,
  validate,
  updateCity
);

router.delete(
  "/:id",
  authMiddleware,
  cityIdValidator,
  validate,
  deleteCity
);

module.exports = router;
