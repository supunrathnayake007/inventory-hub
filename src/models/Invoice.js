const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
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
      discount: { type: Number, default: 0 }, // Discount on item price in percentage
      addon: { type: Number, default: 0 }, // Addon amount for item
    },
  ],
  total_amount: { type: Number, required: true }, // Total amount before discounts and addons
  item_discount_total: { type: Number, required: true }, // Total discount from items
  item_addon_total: { type: Number, required: true }, // Total addons from items
  invoice_discount: { type: Number, default: 0 }, // Discount on total amount in percentage
  invoice_addon: { type: Number, default: 0 }, // Addon amount for invoice
  final_amount: { type: Number, required: true }, // Final amount after all discounts and addons
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

// Middleware to calculate amounts before saving
// invoiceSchema.pre("save", function (next) {
//   calculateAmounts(this);
//   next();
// });

// Middleware to calculate amounts before updating
// invoiceSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.items || update.invoice_discount || update.invoice_addon) {
//     calculateAmounts(update);
//   }
//   next();
// });

// Function to calculate amounts
// function calculateAmounts(invoice) {
//   const itemsWithDiscountsAndAddons = invoice.items.map((item) => {
//     const discount = item.discount || 0;
//     const addon = item.addon || 0;
//     const discountedPrice = item.price - item.price * (discount / 100);
//     const finalPrice = discountedPrice + addon;
//     return { ...item, finalPrice };
//   });

//   invoice.total_amount = itemsWithDiscountsAndAddons.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );
//   invoice.item_discount_total = itemsWithDiscountsAndAddons.reduce(
//     (sum, item) => sum + ((item.price * item.discount) / 100) * item.quantity,
//     0
//   );
//   invoice.item_addon_total = itemsWithDiscountsAndAddons.reduce(
//     (sum, item) => sum + item.addon * item.quantity,
//     0
//   );
//   const amount_after_item_discounts_and_addons =
//     invoice.total_amount -
//     invoice.item_discount_total +
//     invoice.item_addon_total;

//   const invoice_discount = invoice.invoice_discount || 0;
//   const invoice_addon = invoice.invoice_addon || 0;
//   invoice.final_amount =
//     amount_after_item_discounts_and_addons -
//     amount_after_item_discounts_and_addons * (invoice_discount / 100) +
//     invoice_addon;
// }

module.exports =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
