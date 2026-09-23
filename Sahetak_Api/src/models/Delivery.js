const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60,
  },

  quartier: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
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
    maxlength: 60,
  },
});

module.exports = deliverySchema;