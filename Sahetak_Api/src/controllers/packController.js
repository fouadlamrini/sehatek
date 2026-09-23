const Pack = require("../models/Pack");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const { validatePackProducts } = require("../utils/pricingService");

// Order-independent key for an exact combination of products.
const buildCombinationKey = (productIds) =>
  productIds.map(String).sort().join("|");

// Reject packs that contain at least one out-of-stock product.
const assertProductsInStock = async (products) => {
  const inStock = await Product.countDocuments({
    _id: { $in: products },
    stock: { $gt: 0 },
  });

  if (inStock !== products.length) {
    throw new AppError(
      "A pack cannot contain an out-of-stock product",
      400
    );
  }
};

// =========================
// CREATE PACK
// =========================

const createPack = async (req, res, next) => {
  try {
    const { name, products, type, value, active } = req.body;

    // Products must exist (non-empty + unique is validated by middleware).
    await validatePackProducts(products);

    // No out-of-stock product may be bundled into a pack.
    await assertProductsInStock(products);

    // Percentage value must stay within 0-100 (defense in depth, mirrors the
    // express-validator check and updatePack).
    if (type === "percentage" && Number(value) > 100) {
      throw new AppError("Percentage value must not exceed 100", 400);
    }

    // No other Pack with the exact same combination (active or inactive).
    const existing = await Pack.findOne({
      combinationKey: buildCombinationKey(products),
    });

    if (existing) {
      throw new AppError(
        "A pack with the same products already exists",
        409
      );
    }

    const pack = await Pack.create({
      name,
      products,
      type,
      value: Number(value),
      active: active !== undefined ? active : true,
    });

    return res.status(201).json({
      success: true,
      message: "Pack created successfully",
      data: pack,
    });
  } catch (error) {
    // Unique index guard (defense in depth).
    if (error && error.code === 11000) {
      return next(
        new AppError("A pack with the same products already exists", 409)
      );
    }

    next(error);
  }
};

// =========================
// GET ALL PACKS
// =========================

const getPacks = async (req, res, next) => {
  try {
    const packs = await Pack.find()
      .populate("products", "name price image mealDays stock")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Packs retrieved successfully",
      data: packs,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET ONE PACK
// =========================

const getPack = async (req, res, next) => {
  try {
    const pack = await Pack.findById(req.params.id).populate(
      "products",
      "name price image mealDays stock"
    );

    if (!pack) {
      throw new AppError("Pack not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Pack retrieved successfully",
      data: pack,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE PACK
// =========================

const updatePack = async (req, res, next) => {
  try {
    const pack = await Pack.findById(req.params.id);

    if (!pack) {
      throw new AppError("Pack not found", 404);
    }

    const { name, products, type, value, active } = req.body;

    if (name !== undefined) {
      pack.name = name;
    }

    if (products !== undefined) {
      await validatePackProducts(products);

      // No out-of-stock product may be bundled into a pack.
      await assertProductsInStock(products);

      // No other Pack may share the new combination (active or inactive).
      const conflicting = await Pack.findOne({
        _id: { $ne: pack._id },
        combinationKey: buildCombinationKey(products),
      });

      if (conflicting) {
        throw new AppError("A pack with the same products already exists", 409);
      }

      pack.products = products;
    }

    if (type !== undefined) {
      pack.type = type;
    }

    if (value !== undefined) {
      pack.value = Number(value);
    }

    if (active !== undefined) {
      pack.active = active;
    }

    // Percentage value must stay within 0-100 even when only `type` or `value`
    // is changed on its own.
    if (pack.type === "percentage" && pack.value > 100) {
      throw new AppError("Percentage value must not exceed 100", 400);
    }

    await pack.save();

    return res.status(200).json({
      success: true,
      message: "Pack updated successfully",
      data: pack,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return next(
        new AppError("A pack with the same products already exists", 409)
      );
    }

    next(error);
  }
};

// =========================
// DELETE PACK
// =========================

const deletePack = async (req, res, next) => {
  try {
    const pack = await Pack.findById(req.params.id);

    if (!pack) {
      throw new AppError("Pack not found", 404);
    }

    await pack.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Pack deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPack,
  getPacks,
  getPack,
  updatePack,
  deletePack,
};