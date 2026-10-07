const mongoose = require("mongoose");

// Master list of the cities delivery is available in. The customer site
// renders it as a dropdown on the delivery step, so admins manage it here
// instead of every customer typing a free-text city.
const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // Kept in sync with delivery.city on the order, which caps at 60.
      maxlength: 60,
    },

    active: {
      type: Boolean,
      default: true,
    },

    // Derived identity key: the city name, normalised.
    // Used to enforce uniqueness at the database level so "Casablanca" and
    // "  casablanca " cannot both exist.
    cityKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Normalise the name into the identity key on every save.
citySchema.methods.buildCityKey = function () {
  return this.name.toString().trim().toLowerCase();
};

citySchema.pre("validate", async function () {
  this.cityKey = this.buildCityKey();
});

citySchema.index({ cityKey: 1 }, { unique: true });

module.exports = mongoose.model("City", citySchema);
