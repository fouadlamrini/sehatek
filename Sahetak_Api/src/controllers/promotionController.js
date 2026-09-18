const Promotion = require("../models/Promotion");
const AppError = require("../utils/AppError");

const { validatePromotionProduct } = require("../utils/pricingService");

// =========================
// CREATE PROMOTION
// =========================

const createPromotion = async (req, res, next) => {
  try {
    const { product, type, value, active } = req.body;

    // Product must exist.
    await validatePromotionProduct(product);

    // Percentage value must stay within 0-100 (defense in depth, mirrors the
    // express-validator check and updatePromotion).
    if (type === "percentage" && Number(value) > 100) {
      throw new AppError("Percentage value must not exceed 100", 400);
    }

    // Exactly one promotion per product (active or inactive).
    const existing = await Promotion.findOne({ product });

    if (existing) {
      throw new AppError("This product already has a promotion", 409);
    }

    const promotion = await Promotion.create({
      product,
      type,
      value: Number(value),
      active: active !== undefined ? active : true,
    });

    return res.status(201).json({
      success: true,
      message: "Promotion created successfully",
      data: promotion,
    });
  } catch (error) {
    // Unique index guard (defense in depth).
    if (error && error.code === 11000) {
      return next(
        new AppError("This product already has a promotion", 409)
      );
    }

    next(error);
  }
};

// =========================
// GET ALL PROMOTIONS
// =========================

const getPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find()
      .populate("product", "name price image mealDays stock")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Promotions retrieved successfully",
      data: promotions,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET ONE PROMOTION
// =========================

const getPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "product",
      "name price image mealDays stock"
    );

    if (!promotion) {
      throw new AppError("Promotion not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Promotion retrieved successfully",
      data: promotion,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE PROMOTION
// =========================

const updatePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      throw new AppError("Promotion not found", 404);
    }

    const { product, type, value, active } = req.body;

    if (product !== undefined) {
      await validatePromotionProduct(product);

      const other = await Promotion.findOne({
        _id: { $ne: promotion._id },
        product,
      });

      if (other) {
        throw new AppError("This product already has a promotion", 409);
      }

      promotion.product = product;
    }

    if (type !== undefined) {
      promotion.type = type;
    }

    if (value !== undefined) {
      promotion.value = Number(value);
    }

    if (active !== undefined) {
      promotion.active = active;
    }

    // Percentage value must stay within 0-100 even when only `type` or `value`
    // is changed on its own.
    if (promotion.type === "percentage" && promotion.value > 100) {
      throw new AppError("Percentage value must not exceed 100", 400);
    }

    // Exactly one promotion per product (active or inactive).
    if (promotion.active) {
      const conflicting = await Promotion.findOne({
        _id: { $ne: promotion._id },
        product: promotion.product,
      });

      if (conflicting) {
        throw new AppError("This product already has a promotion", 409);
      }
    }

    await promotion.save();

    return res.status(200).json({
      success: true,
      message: "Promotion updated successfully",
      data: promotion,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return next(
        new AppError("This product already has a promotion", 409)
      );
    }

    next(error);
  }
};

// =========================
// DELETE PROMOTION
// =========================

const deletePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      throw new AppError("Promotion not found", 404);
    }

    await promotion.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPromotion,
  getPromotions,
  getPromotion,
  updatePromotion,
  deletePromotion,
};