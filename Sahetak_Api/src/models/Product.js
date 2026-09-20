const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    // Cloudinary public_id of the product image. Used to delete the asset
    // from Cloudinary when the product is updated with a new image or deleted.
    // Legacy products created before the Cloudinary migration have no
    // publicId and keep their old image URL untouched.
    publicId: {
      type: String,
      trim: true,
      default: null,
    },

    mealDays: {
      type: [String],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    // Derived identity key: name + mealDays + price
    // Used to enforce uniqueness at the database level.
    productKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A single product identity = (name + mealDays + price).
// mealDays is an array, so a compound unique index on it would be a
// multikey index and would wrongly reject products that just share one
// overlapping day (e.g. ["Monday","Tuesday"] vs ["Monday","Wednesday"]).
// Instead we derive a deterministic key on a single field and make
// that field unique. mealDays is sorted so day order does not matter.
// name and days are normalized (trim + lowercase) so case does not matter.
productSchema.methods.buildProductKey = function () {
  const normalizedName = this.name.toString().trim().toLowerCase();

  const normalizedDays = this.mealDays
    .map((day) => day.toString().trim().toLowerCase())
    .filter((day) => day !== "")
    .sort()
    .join("|");

  return `${normalizedName}|${normalizedDays}|${Number(this.price)}`;
};

productSchema.pre("validate", async function () {
  this.productKey = this.buildProductKey();
});

productSchema.index({ productKey: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);