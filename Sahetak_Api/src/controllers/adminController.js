const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const RefreshToken = require("../models/RefreshToken");
const AppError = require("../utils/AppError");

// =========================
// LIST ADMINS
// =========================

const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Admins retrieved successfully",
      data: admins.map((admin) => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// CREATE ADMIN
// =========================

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      throw new AppError("Email already in use", 409);
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE ADMIN
// =========================

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid admin id", 400);
    }

    if (id === req.admin.id) {
      throw new AppError("You cannot delete your own account", 400);
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    if (admin.role === "super_admin") {
      throw new AppError("Super admin accounts cannot be deleted", 403);
    }

    // Revoke all active sessions of the deleted admin
    await RefreshToken.deleteMany({ admin: admin._id });

    await admin.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdmins,
  createAdmin,
  deleteAdmin,
};