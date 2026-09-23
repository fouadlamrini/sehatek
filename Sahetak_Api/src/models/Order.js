const mongoose = require("mongoose");
const crypto = require("crypto");

const orderItemSchema = require("./OrderItem");
const customerSchema = require("./Customer");
const deliverySchema = require("./Delivery");

const orderSchema = new mongoose.Schema(
  {
    trackingCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Cryptographically random 10-character suffix (~1 quadrillion combos),
      // so the code + phone pair is effectively unguessable.
      default: () =>
        "STK-" +
        Array.from(crypto.randomBytes(6))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("")
          .slice(0, 10)
          .toUpperCase(),
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one item",
      },
    },

    customer: {
      type: customerSchema,
      required: true,
    },

    delivery: {
      type: deliverySchema,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      default: null,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "delivering",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);