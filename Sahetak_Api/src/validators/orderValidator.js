const { body, param } = require("express-validator");

const ALLOWED_LOCATION_TYPES = [
  "company",
  "home",
  "other",
  "direct",
];

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

const orderIdValidator = [
  param("id").isMongoId().withMessage("Invalid order id"),
];

const createOrderValidator = [
  body("items")
    .isArray({ min: 1, max: 20 })
    .withMessage("Order must contain between 1 and 20 items"),

  body("items.*.product")
    .isMongoId()
    .withMessage("Each item must have a valid product id"),

  body("items.*.mealDay")
    .trim()
    .notEmpty()
    .withMessage("Each item must have a mealDay")
    .isLength({ max: 30 })
    .withMessage("mealDay is too long"),

  body("items.*.quantity")
    .isInt({ min: 1, max: 20 })
    .withMessage("Quantity must be an integer between 1 and 20"),

  body("items.*.note")
    .optional()
    .isString()
    .withMessage("Note must be a string")
    .isLength({ max: 200 })
    .withMessage("Note must not exceed 200 characters"),

  body("customer.name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ max: 60 })
    .withMessage("Customer name is too long"),

  body("customer.phone")
    .trim()
    .notEmpty()
    .withMessage("Customer phone is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Phone number is invalid"),

  body("delivery.city")
    .trim()
    .notEmpty()
    .withMessage("Delivery city is required")
    .isLength({ max: 60 })
    .withMessage("City is too long"),

  body("delivery.quartier")
    .trim()
    .notEmpty()
    .withMessage("Delivery quartier is required")
    .isLength({ max: 100 })
    .withMessage("Quartier is too long"),

  body("delivery.locationType")
    .isIn(ALLOWED_LOCATION_TYPES)
    .withMessage("Invalid delivery type"),

  body("delivery.receiverName")
    .optional()
    .isString()
    .withMessage("Receiver name must be a string")
    .isLength({ max: 60 })
    .withMessage("Receiver name is too long"),
];

const updateOrderStatusValidator = [
  body("status")
    .isIn(ALLOWED_STATUSES)
    .withMessage("Invalid order status"),
];

const guestIdentityValidator = [
  body("trackingCode")
    .trim()
    .notEmpty()
    .withMessage("Tracking code is required")
    .isLength({ max: 40 })
    .withMessage("Tracking code is too long")
    .matches(/^STK-[A-Z0-9]{6,40}$/i)
    .withMessage("Invalid tracking code format"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Phone number is invalid"),
];

const guestTrackValidator = guestIdentityValidator;

// Mutations require the signed, short-lived token issued by /orders/track.
const guestCancelValidator = [
  ...guestIdentityValidator,

  body("trackToken")
    .notEmpty()
    .withMessage("Track token is required"),
];

const guestUpdateValidator = [
  ...guestIdentityValidator,

  body("trackToken")
    .notEmpty()
    .withMessage("Track token is required"),

  body("customerName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Customer name must not be empty")
    .isLength({ max: 60 })
    .withMessage("Customer name is too long"),

  body("newPhone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("New phone must not be empty")
    .isLength({ min: 8, max: 20 })
    .withMessage("New phone number is invalid"),

  body("delivery.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City must not be empty")
    .isLength({ max: 60 })
    .withMessage("City is too long"),

  body("delivery.quartier")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Quartier must not be empty")
    .isLength({ max: 100 })
    .withMessage("Quartier is too long"),

  body("delivery.locationType")
    .optional()
    .isIn(ALLOWED_LOCATION_TYPES)
    .withMessage("Invalid delivery type"),

  body("delivery.receiverName")
    .optional()
    .isString()
    .withMessage("Receiver name must be a string")
    .isLength({ max: 60 })
    .withMessage("Receiver name is too long"),
];

module.exports = {
  orderIdValidator,
  createOrderValidator,
  updateOrderStatusValidator,
  guestTrackValidator,
  guestCancelValidator,
  guestUpdateValidator,
};