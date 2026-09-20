const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const AppError = require("../utils/AppError");
const {
  calculatePromotionPrice,
} = require("../utils/pricingService");
const {
  uploadProductImage,
  deleteCloudinaryImage,
} = require("../utils/cloudinaryService");

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

    // The image arrives via multer (memoryStorage) as req.file.buffer.
    const uploaded = await uploadProductImage(req.file.buffer);

    let product;

    try {
      product = await Product.create({
        name,
        image: uploaded.url,
        publicId: uploaded.publicId,
        mealDays,
        price: Number(price),
        stock: Number(stock),
      });
    } catch (error) {
      // DB failed -> roll back the freshly uploaded Cloudinary image so we do
      // not leave an orphan asset, then delegate to the centralized handler.
      await deleteCloudinaryImage(uploaded.publicId).catch(() => {});

      throw error;
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
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
      throw new AppError("Product not found", 404);
    }

    const oldPublicId = product.publicId;

    const { name, mealDays, price, stock } = req.body;

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

    // New image uploaded: upload to Cloudinary FIRST. The old image is only
    // deleted AFTER the database successfully references the new one.
    let uploaded = null;

    if (req.file) {
      uploaded = await uploadProductImage(req.file.buffer);

      product.image = uploaded.url;
      product.publicId = uploaded.publicId;
    }

    try {
      await product.save();
    } catch (error) {
      // DB failed -> roll back the newly uploaded Cloudinary image.
      if (uploaded) {
        await deleteCloudinaryImage(uploaded.publicId).catch(() => {});
      }

      throw error;
    }

    // DB now references the new image, so the old image can be deleted safely.
    if (uploaded && oldPublicId) {
      await deleteCloudinaryImage(oldPublicId);
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
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
// DELETE PRODUCT
// =========================

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    // Delete the Cloudinary image first (already-deleted assets are ignored),
    // then remove the document. Deleting the document directly in MongoDB
    // bypasses this endpoint and cannot trigger the Cloudinary deletion.
    if (product.publicId) {
      await deleteCloudinaryImage(product.publicId);
    }

    await Product.findByIdAndDelete(req.params.id);

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