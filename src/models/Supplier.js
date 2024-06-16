const mongoose = require("mongoose");

// Define schema for Supplier
const supplierSchema = new mongoose.Schema({
  supplier_name: {
    type: String,
    required: true,
  },
  contact_name: String,
  address: String,
  phone: String,
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
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

module.exports =
  mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);
