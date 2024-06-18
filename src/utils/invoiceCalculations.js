// utils/invoiceCalculations.js

const calculateInvoiceAmounts = (items, invoiceData) => {
  let total_amount = 0;
  let item_discount_total = 0;
  let item_addon_total = 0;

  for (const item of items) {
    const items_price = item.price * item.quantity;
    const itemAddonPercentage = item.addon_percentage || 0;
    const itemAddonValue = item.addon_value || 0;
    const itemDiscountPercentage = item.discount_percentage || 0;
    const itemDiscountValue = item.discount_value || 0;

    const finalPrice =
      items_price *
        (1 - itemDiscountPercentage / 100 + itemAddonPercentage / 100) -
      itemDiscountValue +
      itemAddonValue;

    total_amount += finalPrice;
    item_discount_total +=
      items_price * (itemDiscountPercentage / 100) + itemDiscountValue;
    item_addon_total +=
      items_price * (itemAddonPercentage / 100) + itemAddonValue;
  }

  // Calculate final amount considering invoice discounts and addons
  const invoiceDiscountPercentage =
    invoiceData.invoice_discount_percentage || 0;
  const invoiceDiscountValue = invoiceData.invoice_discount_value || 0;
  const invoiceAddonPercentage = invoiceData.invoice_addon_percentage || 0;
  const invoiceAddonValue = invoiceData.invoice_addon_value || 0;

  const final_amount =
    total_amount *
      (1 - invoiceDiscountPercentage / 100 + invoiceAddonPercentage / 100) +
    invoiceAddonValue -
    invoiceDiscountValue;
  const final_amount_fixed = parseFloat(final_amount.toFixed(2));
  if (
    isNaN(total_amount) ||
    isNaN(item_discount_total) ||
    isNaN(item_addon_total) ||
    isNaN(final_amount_fixed)
  ) {
    throw new Error("Not enough data provided");
  }

  return {
    total_amount,
    item_discount_total,
    item_addon_total,
    final_amount_fixed,
  };
};

module.exports = {
  calculateInvoiceAmounts,
};
