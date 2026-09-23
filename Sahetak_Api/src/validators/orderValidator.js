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
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.product")
    .isMongoId()
    .withMessage("Each item must have a valid product id"),

  body("items.*.mealDay")
    .trim()
    .notEmpty()
    .withMessage("Each item must have a mealDay"),

  body("items.*.quantity")
    .isInt({ min: 1, max: 20 })
    .withMessage("Quantity must be an integer between 1 and 20"),

  body("items.*.note")
    .optional()
    .isString()
    .withMessage("Note must be a string"),

  body("customer.name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required"),

  body("customer.phone")
    .trim()
    .notEmpty()
    .withMessage("Customer phone is required"),

  body("delivery.city")
    .trim()
    .notEmpty()
    .withMessage("Delivery city is required"),

  body("delivery.quartier")
    .trim()
    .notEmpty()
    .withMessage("Delivery quartier is required"),

  body("delivery.locationType")
    .isIn(ALLOWED_LOCATION_TYPES)
    .withMessage("Invalid delivery type"),

  body("delivery.receiverName")
    .optional()
    .isString()
    .withMessage("Receiver name must be a string"),

  body("delivery.latitude")
    .optional({ values: "null" })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("delivery.longitude")
    .optional({ values: "null" })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
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
    .withMessage("Tracking code is required"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),
];

const guestTrackValidator = guestIdentityValidator;

const guestCancelValidator = guestIdentityValidator;

const guestUpdateValidator = [
  ...guestIdentityValidator,

  body("customerName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Customer name must not be empty"),

  body("newPhone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("New phone must not be empty"),

  body("delivery.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City must not be empty"),

  body("delivery.quartier")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Quartier must not be empty"),

  body("delivery.locationType")
    .optional()
    .isIn(ALLOWED_LOCATION_TYPES)
    .withMessage("Invalid delivery type"),

  body("delivery.receiverName")
    .optional()
    .isString()
    .withMessage("Receiver name must be a string"),

  body("delivery.latitude")
    .optional({ values: "null" })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("delivery.longitude")
    .optional({ values: "null" })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

module.exports = {
  orderIdValidator,
  createOrderValidator,
  updateOrderStatusValidator,
  guestTrackValidator,
  guestCancelValidator,
  guestUpdateValidator,
};