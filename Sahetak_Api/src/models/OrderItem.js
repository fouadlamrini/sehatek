const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  mealDay: {
    type: String,
    required: true,
    maxlength: 30,
  },

 quantity: {
  type: Number,
  required: true,
  min: 1,
  max: 20,
},

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  note: {
    type: String,
    default: "",
    trim: true,
    maxlength: 200,
  },
});

module.exports = orderItemSchema;