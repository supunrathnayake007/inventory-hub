const mongoose = require("mongoose");

// Define schema for PurchaseOrder
const purchaseOrderSchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier", // Assuming you have a Supplier model
    required: true,
  },
  buyer_name: {
    type: String,
    default: "",
  },
  buyer_contact: {
    type: String,
    default: "",
  },
  shipping_address: {
    type: String,
    default: "",
  },
  shipping_method: {
    type: String,
    default: "",
  },
  shipping_date: {
    type: Date,
    default: null,
  },
  tracking_number: {
    type: String,
    default: "",
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"], // Define possible values for status
    default: "Pending",
  },
  items: [
    {
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // Assuming you have an Item model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports =
  mongoose.models.PurchaseOrder ||
  mongoose.model("PurchaseOrder", purchaseOrderSchema);
