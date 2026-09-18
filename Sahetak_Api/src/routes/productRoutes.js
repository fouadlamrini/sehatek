const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  productIdValidator,
  createProductValidator,
  updateProductValidator,
} = require("../validators/productValidator");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", productIdValidator, validate, getProduct);

// Admin only
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createProductValidator,
  validate,
  createProduct
);

router.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  productIdValidator,
  updateProductValidator,
  validate,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  productIdValidator,
  validate,
  deleteProduct
);

module.exports = router;