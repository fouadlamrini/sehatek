const AppError = require("../utils/AppError");
const logger = require("../config/logger");

// =========================
// FRIENDLY MESSAGES
// =========================

// Readable message for MongoDB duplicate-key errors (code 11000).
const buildDuplicateMessage = (err) => {
  const fieldMap = {
    productKey:
      "A product with the same name, meal days and price already exists",
    combinationKey: "A pack with the same products already exists",
    email: "Email is already in use",
    product: "A conflict exists for this product",
  };

  const field = err.keyValue ? Object.keys(err.keyValue)[0] : null;

  if (field && fieldMap[field]) {
    return fieldMap[field];
  }

  return "Duplicate value already exists";
};

// Build a single readable message from a Mongoose ValidationError.
const buildValidationMessage = (err) => {
  const messages = Object.values(err.errors || {}).map((e) => e.message);

  return messages.length > 0 ? messages.join(", ") : "Validation failed";
};

// Readable message for Multer errors.
const multerMessage = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return "File too large. Maximum allowed size is 5MB";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return "Unexpected file field";
  }

  return err.message;
};

// =========================
// LOGGING (no secrets logged:
// no passwords, tokens, authorization headers or env values)
// =========================

const logError = (err, req, statusCode) => {
  const context = {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    stack: err.stack,
  };

  if (statusCode >= 500) {
    logger.error(err.message, context);
  } else {
    logger.warn(err.message, context);
  }
};

// =========================
// CENTRAL ERROR HANDLER
// =========================

const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // 1. Operational errors thrown as AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "CastError") {
    // 2. Invalid ObjectId
    statusCode = 400;
    message =
      process.env.NODE_ENV === "production"
        ? "Invalid id format"
        : `Invalid ${err.path} format`;
  } else if (err.name === "ValidationError") {
    // 3. Mongoose validation error
    statusCode = 400;
    message = buildValidationMessage(err);
  } else if (err.code === 11000) {
    // 4. MongoDB duplicate key
    statusCode = 409;
    message = buildDuplicateMessage(err);
  } else if (err.name === "JsonWebTokenError") {
    // 5. Invalid JWT
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    // 6. Expired JWT
    statusCode = 401;
    message = "Token has expired";
  } else if (err.name === "MulterError") {
    // 7. Multer upload errors (file too large, unexpected field)
    statusCode = 400;
    message = multerMessage(err);
  } else if (err.type === "entity.parse.failed") {
    // 8. Malformed JSON body
    statusCode = 400;
    message = "Invalid request body";
  } else if (err.statusCode && err.statusCode < 500) {
    // 9. Safety net for errors already carrying a 4xx status code
    statusCode = err.statusCode;
    message = err.message;
  }

  // Unknown errors never expose internal details to the client.
  if (statusCode === 500) {
    message = "Internal Server Error";
  }

  logError(err, req, statusCode);

  const payload = { success: false, message };

  // Stack is only attached in development for easier debugging.
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
};

module.exports = errorMiddleware;