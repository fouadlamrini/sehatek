const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    value: {
      type: Number,
      required: true,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Only ONE promotion per product is allowed (active or inactive).
// `active` only toggles whether the discount is applied.
promotionSchema.index({ product: 1 }, { unique: true });

module.exports = mongoose.model("Promotion", promotionSchema);