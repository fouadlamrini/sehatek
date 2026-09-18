const mongoose = require("mongoose");

const packSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      ],
      required: true,
      validate: [
        {
          validator: (products) => products.length > 0,
          message: "Pack must contain at least one product",
        },
        {
          validator: (products) =>
            new Set(products.map(String)).size === products.length,
          message: "Pack cannot contain duplicate products",
        },
      ],
    },

    // How the Pack price is computed from the products' original total:
    //   "price"      -> value is the FINAL pack price
    //   "fixed"      -> value is a discount amount (origin - value)
    //   "percentage" -> value is a discount percentage (origin - value% of origin)
    type: {
      type: String,
      enum: ["price", "fixed", "percentage"],
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

    // Derived key: sorted product ids. Used to detect two ACTIVE Packs
    // representing the exact same combination (order does not matter).
    combinationKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

packSchema.methods.buildCombinationKey = function () {
  return this.products
    .map((id) => id.toString())
    .sort()
    .join("|");
};

packSchema.pre("validate", async function () {
  this.combinationKey = this.buildCombinationKey();
});

// No two Packs may share the same combination (active or inactive).
// `active` only toggles whether the Pack is applied by the pricing engine.
packSchema.index({ combinationKey: 1 }, { unique: true });

module.exports = mongoose.model("Pack", packSchema);