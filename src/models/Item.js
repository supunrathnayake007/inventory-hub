const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Assuming you have a Category model
  },
  price: {
    type: Number,
    required: true,
  },
  quantity_in_stock: {
    type: Number,
    default: 0,
  },
  reorder_level: {
    type: Number,
    default: 0,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Item || mongoose.model("Item", itemSchema);
