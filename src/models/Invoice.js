const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  items: [
    {
      _id: false, // This will prevent Mongoose from generating _id for each subdocument
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      discount_percentage: { type: Number, default: 0 }, // Discount on item price in percentage
      discount_value: { type: Number, default: 0 }, // Discount on item price in value
      addon_percentage: { type: Number, default: 0 }, // Addon on item price in percentage
      addon_value: { type: Number, default: 0 }, // Addon on item price in value
    },
  ],
  total_amount: { type: Number, required: true }, // Total amount before discounts and addons
  item_discount_total: { type: Number, required: true }, // Total discount from items
  item_addon_total: { type: Number, required: true }, // Total addons from items
  invoice_discount_percentage: { type: Number, default: 0 }, // Discount on total amount in percentage
  invoice_discount_value: { type: Number, default: 0 }, // Discount on total amount in value
  invoice_addon_percentage: { type: Number, default: 0 }, // Addon on total amount in percentage
  invoice_addon_value: { type: Number, default: 0 }, // Addon on total amount in value
  final_amount_fixed: { type: Number, required: true }, // Final amount after all discounts and addons
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "paid", "canceled"],
    default: "pending",
  },
  invoice_number: { type: String, required: true, unique: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
});

module.exports =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
