const express = require("express");

const {
  getAdmins,
  createAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

const {
  createAdminValidator,
  deleteAdminValidator,
} = require("../validators/adminValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { requireSuperAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// All admin management routes require a super admin
router.use(authMiddleware, requireSuperAdmin);

router.get("/", getAdmins);

router.post("/", createAdminValidator, validate, createAdmin);

router.delete("/:id", deleteAdminValidator, validate, deleteAdmin);

module.exports = router;
