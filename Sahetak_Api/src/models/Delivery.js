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
});

module.exports = deliverySchema;