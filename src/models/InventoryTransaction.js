// models/InventoryTransaction.js
const mongoose = require("mongoose");

const inventoryTransactionSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  transaction_date: { type: Date, default: Date.now },
  quantity: { type: Number, required: true },
  transaction_type: {
    type: String,
    enum: ["purchase", "sale", "adjustment"],
    required: true,
  },
  reference_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
});

module.exports =
  mongoose.models.InventoryTransaction ||
  mongoose.model("InventoryTransaction", inventoryTransactionSchema);
