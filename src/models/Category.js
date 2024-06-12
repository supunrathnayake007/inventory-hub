// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true },
});

module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
