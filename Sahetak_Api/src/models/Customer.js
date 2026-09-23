const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
});

module.exports = customerSchema;