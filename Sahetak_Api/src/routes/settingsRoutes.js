const express = require("express");

const {
  getPublicSettings,
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public — used by the customer site to render the site header.
router.get("/public", getPublicSettings);

// Admin only
router.get("/", authMiddleware, getSettings);

router.patch(
  "/",
  authMiddleware,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;