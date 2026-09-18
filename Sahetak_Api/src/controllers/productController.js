const fs = require("fs");
const path = require("path");

const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const AppError = require("../utils/AppError");
const { calculatePromotionPrice } = require("../utils/pricingService");

// =========================
// PROMOTION VIEW HELPERS
// =========================

// Original price + price after the active Promotion (if any).
const buildPromotionView = (product, promotion) => {
  if (!promotion) {
    return null;
  }

  const calc = calculatePromotionPrice(product.price, promotion);

  return {
    _id: promotion._id,
    type: promotion.type,
    value: promotion.value,
    originalPrice: calc.originalPrice,
    discountAmount: calc.discountAmount,
    finalPrice: calc.finalPrice,
  };
};

const withPromotion = (product, promotion) => ({
  ...product,
  promotion: buildPromotionView(product, promotion),
});

// =========================
// CREATE PRODUCT
// =========================

const createProduct = async (req, res, next) => {
  try {
    const { name, mealDays, price, stock } = req.body;

    const product = await Product.create({
      name,
      image: `/uploads/products/${req.file.filename}`,
      mealDays,
      price: Number(price),
      stock: Number(stock),
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Delete uploaded image if database creation fails
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../uploads/products",
        req.file.filename
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Duplicate product (name + mealDays + price already exists)
    if (error && error.code === 11000) {
      return next(
        new AppError(
          "A product with the same name, meal days and price already exists",
          409
        )
      );
    }

    next(error);
  }
};

// =========================
// GET ALL PRODUCTS
// =========================

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    }).lean();

    const ids = products.map((product) => product._id);

    const activePromotions = ids.length
      ? await Promotion.find({
          active: true,
          product: { $in: ids },
        })
      : [];

    const promotionByProduct = new Map(
      activePromotions.map((promotion) => [
        promotion.product.toString(),
        promotion,
      ])
    );

    const data = products.map((product) =>
      withPromotion(product, promotionByProduct.get(product._id.toString()))
    );

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET ONE PRODUCT
// =========================

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const activePromotion = await Promotion.findOne({
      product: product._id,
      active: true,
    });

    const data = withPromotion(product, activePromotion);

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE PRODUCT
// =========================

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      // If a new image was uploaded, delete it
      if (req.file) {
        const newImagePath = path.join(
          __dirname,
          "../uploads/products",
          req.file.filename
        );

        if (fs.existsSync(newImagePath)) {
          fs.unlinkSync(newImagePath);
        }
      }

      throw new AppError("Product not found", 404);
    }

    const oldImage = product.image;

    const {
      name,
      mealDays,
      price,
      stock,
    } = req.body;

    if (name !== undefined) {
      product.name = name;
    }

    if (mealDays !== undefined) {
      product.mealDays = mealDays;
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    // New image uploaded
    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    }

    await product.save();

    // Delete old image after successful database update
    if (req.file && oldImage) {
      const oldImageName = path.basename(oldImage);

      const oldImagePath = path.join(
        __dirname,
        "../uploads/products",
        oldImageName
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    // Delete newly uploaded image if update failed
    if (req.file) {
      const newImagePath = path.join(
        __dirname,
        "../uploads/products",
        req.file.filename
      );

      if (fs.existsSync(newImagePath)) {
        fs.unlinkSync(newImagePath);
      }
    }

    next(error);
  }
};

// =========================
// DELETE PRODUCT
// =========================

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const image = product.image;

    await Product.findByIdAndDelete(req.params.id);

    // Delete image
    if (image) {
      const imageName = path.basename(image);

      const imagePath = path.join(
        __dirname,
        "../uploads/products",
        imageName
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};