const mongoose = require("mongoose");

const orderItemSchema = require("./OrderItem");
const customerSchema = require("./Customer");
const deliverySchema = require("./Delivery");

const orderSchema = new mongoose.Schema(
  {
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