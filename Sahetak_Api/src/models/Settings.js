const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: null,
    },

    publicId: {
      type: String,
      default: null,
    },
  },
  {
    _id: false,
  }
);

// Single-document collection holding the public site branding:
// the profile picture (logo/avatar) and the banner picture.
// The publicIds are kept so replaced images can be deleted cleanly on Cloudinary.
const settingsSchema = new mongoose.Schema(
  {
    profileImage: {
      type: imageSchema,
      default: null,
    },

    bannerImage: {
      type: imageSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);