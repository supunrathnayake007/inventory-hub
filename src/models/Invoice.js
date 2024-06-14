// models/Invoice.js
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  purchase_order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PurchaseOrder", // Reference to PurchaseOrder model (optional)
  },
  items: [
    {
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total_amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "paid", "canceled"],
    default: "pending",
  },
  invoice_number: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
