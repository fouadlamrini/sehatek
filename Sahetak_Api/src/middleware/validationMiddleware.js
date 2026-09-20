const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = {};

    errors.array().forEach((error) => {
      const field = error.path || error.param || "general";

      if (!errorMessages[field]) {
        errorMessages[field] = error.msg;
      }
    });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};

module.exports = validate;