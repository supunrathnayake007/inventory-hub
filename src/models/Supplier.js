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
});

module.exports =
  mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);
