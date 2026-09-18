const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");
const AppError = require("../utils/AppError");

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

    // Verify token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // JsonWebTokenError / TokenExpiredError
      // are mapped to 401 by the error middleware.
      return next(error);
    }

    // Check if token has been blacklisted (logout)
    const blacklisted = await BlacklistedToken.findOne({ token });

    if (blacklisted) {
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