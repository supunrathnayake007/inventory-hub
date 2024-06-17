// utils/invoiceCalculations.js

function calculateItemFinalPrice(item) {
  const discount = item.discount || 0;
  const addon = item.addon || 0;
  const discountedPrice = item.price - item.price * (discount / 100);
  return discountedPrice + addon;
}

const calculateInvoiceAmounts = (items, invoiceData) => {
  let total_amount = 0;
  let item_discount_total = 0;
  let item_addon_total = 0;

  // Calculate totals from items
  items.forEach((item) => {
    const itemAddon = item.addon || 0;
    const itemDiscount = item.discount || 0;
    const discountedPrice = item.price * (1 - itemDiscount / 100);
    total_amount += discountedPrice * item.quantity;
    item_discount_total += item.price * (itemDiscount / 100) * item.quantity;
    item_addon_total += itemAddon * item.quantity;
  });

  // Calculate final amount considering invoice discounts and addons
  const invoice_discount = invoiceData.invoice_discount || 0;
  const invoice_addon = invoiceData.invoice_addon || 0;
  const amount_after_item_discounts_and_addons =
    total_amount - item_discount_total + item_addon_total;
  const final_amount =
    amount_after_item_discounts_and_addons -
    amount_after_item_discounts_and_addons * (invoice_discount / 100) +
    invoice_addon;

  if (
    !total_amount ||
    !item_discount_total ||
    !item_addon_total ||
    !final_amount
  ) {
    throw new Error("Not enough data provided");
  }

  return {
    total_amount,
    item_discount_total,
    item_addon_total,
    final_amount,
  };
};

module.exports = {
  calculateItemFinalPrice,
  calculateInvoiceAmounts,
};
