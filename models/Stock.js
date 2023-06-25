const mongoose = require("mongoose");

// Stock Schema
const StockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  purchaseRate: {
    type: Number,
    required: true,
  },
  salesRate: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
