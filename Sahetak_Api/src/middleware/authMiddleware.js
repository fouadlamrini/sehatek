const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const BlacklistedToken = require("../models/BlacklistedToken");
const AppError = require("../utils/AppError");
const { hashToken } = require("../utils/generateToken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader) {
      return next(new AppError("Access denied. No token provided", 401));
    }

    // Expected:
    // Authorization: Bearer TOKEN

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(new AppError("Invalid authorization format", 401));
    }

    const token = parts[1];

    // Verify token (explicit algorithm pins the signature scheme)
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
    } catch (error) {
      // JsonWebTokenError / TokenExpiredError
      // are mapped to 401 by the error middleware.
      return next(error);
    }

    // Check if token has been blacklisted (logout) — store only the hash
    const blacklisted = await BlacklistedToken.findOne({
      token: hashToken(token),
    });

    if (blacklisted) {
      return next(new AppError("Token has been revoked", 401));
    }

    // Re-fetch the admin so role/version checks reflect the current document
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return next(new AppError("Access denied. Admin not found", 401));
    }

    // Token version: bumped on password change to revoke old sessions
    if ((decoded.v ?? 0) !== (admin.tokenVersion ?? 0)) {
      return next(new AppError("Token has been revoked", 401));
    }

    // Save admin information and token in request
    req.admin = decoded;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;