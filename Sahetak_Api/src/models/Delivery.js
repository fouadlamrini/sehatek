const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },

  quartier: {
    type: String,
    required: true,
    trim: true,
  },

  locationType: {
    type: String,
    enum: ["company", "home", "other", "direct"],
    required: true,
  },

  receiverName: {
    type: String,
    default: "",
    trim: true,
  },

  latitude: {
    type: Number,
    min: -90,
    max: 90,
    default: null,
  },

  longitude: {
    type: Number,
    min: -180,
    max: 180,
    default: null,
  },
});

module.exports = deliverySchema;