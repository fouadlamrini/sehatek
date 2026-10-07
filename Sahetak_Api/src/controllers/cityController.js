const City = require("../models/City");
const AppError = require("../utils/AppError");

// =========================
// CREATE CITY
// =========================

const createCity = async (req, res, next) => {
  try {
    const { name, active } = req.body;

    // Only one city per normalised name (active or inactive).
    const existing = await City.findOne({ cityKey: name.trim().toLowerCase() });

    if (existing) {
      throw new AppError("This city already exists", 409);
    }

    const city = await City.create({
      name,
      active: active !== undefined ? active : true,
    });

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  } catch (error) {
    // Unique index guard (defense in depth).
    if (error && error.code === 11000) {
      return next(new AppError("This city already exists", 409));
    }

    next(error);
  }
};

// =========================
// GET ALL CITIES
// =========================

const getCities = async (req, res, next) => {
  try {
    // ?activeOnly=true is used by the customer site dropdown, which must only
    // ever show the cities delivery is currently available in.
    const activeOnly = req.query.activeOnly === "true";

    const filter = activeOnly ? { active: true } : {};

    const cities = await City.find(filter).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Cities retrieved successfully",
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET ONE CITY
// =========================

const getCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      throw new AppError("City not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "City retrieved successfully",
      data: city,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE CITY
// =========================

const updateCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      throw new AppError("City not found", 404);
    }

    const { name, active } = req.body;

    if (name !== undefined) {
      const conflicting = await City.findOne({
        _id: { $ne: city._id },
        cityKey: name.trim().toLowerCase(),
      });

      if (conflicting) {
        throw new AppError("This city already exists", 409);
      }

      city.name = name;
    }

    if (active !== undefined) {
      city.active = active;
    }

    await city.save();

    return res.status(200).json({
      success: true,
      message: "City updated successfully",
      data: city,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return next(new AppError("This city already exists", 409));
    }

    next(error);
  }
};

// =========================
// DELETE CITY
// =========================

const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      throw new AppError("City not found", 404);
    }

    // Orders keep a free-text copy of the city, so removing a city never
    // touches historical orders.
    await city.deleteOne();

    return res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCity,
  getCities,
  getCity,
  updateCity,
  deleteCity,
};
