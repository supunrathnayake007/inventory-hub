// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true },
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

module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
