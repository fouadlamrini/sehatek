const Admin = require("../models/Admin");
const AppError = require("../utils/AppError");

const requireSuperAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin || admin.role !== "super_admin") {
      return next(new AppError("Access denied. Super admin only", 403));
    }

    req.superAdmin = admin;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireSuperAdmin };