const express = require("express");

const {
  createPack,
  getPacks,
  getPack,
  updatePack,
  deletePack,
} = require("../controllers/packController");

const {
  packIdValidator,
  createPackValidator,
  updatePackValidator,
} = require("../validators/packValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getPacks);
router.get("/:id", packIdValidator, validate, getPack);

// Admin routes
router.post(
  "/",
  authMiddleware,
  createPackValidator,
  validate,
  createPack
);

router.patch(
  "/:id",
  authMiddleware,
  packIdValidator,
  updatePackValidator,
  validate,
  updatePack
);

router.delete(
  "/:id",
  authMiddleware,
  packIdValidator,
  validate,
  deletePack
);

module.exports = router;