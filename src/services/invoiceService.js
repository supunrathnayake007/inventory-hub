// services/invoiceService.js
const Invoice = require("../models/Invoice");
const inventoryTransactionService = require("./inventoryTransactionService");

async function generateInvoiceNumber() {
  const lastInvoice = await Invoice.findOne().sort({ date: -1 }).exec();
  if (lastInvoice && lastInvoice.invoice_number) {
    const lastNumber = parseInt(lastInvoice.invoice_number.split("-")[1], 10);
    const newNumber = lastNumber + 1;
    return `INV-${newNumber.toString().padStart(10, "0")}`;
  } else {
    return "INV-0000000001";
  }
}

exports.createInvoice = async (invoiceData) => {
  const session = await Invoice.startSession();
  session.startTransaction();

  try {
    const invoice_number = await generateInvoiceNumber();
    const invoice = new Invoice({
      ...invoiceData,
      invoice_number,
    });
    await invoice.save({ session });

    for (let item of invoice.items) {
      const transactionData = {
        item_id: item.item_id,
        transaction_date: new Date(),
        quantity: item.quantity,
        transaction_type: "sale",
        reference_id: invoice._id,
      };
      await inventoryTransactionService.createInventoryTransaction(
        transactionData
      );
    }

    await session.commitTransaction();
    session.endSession();
    return invoice;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getInvoiceById = async (id) => {
  return await Invoice.findById(id); //.populate("items.item_id");
};

exports.updateInvoice = async (id, invoiceData) => {
  return await Invoice.findByIdAndUpdate(id, invoiceData, { new: true });
};

exports.deleteInvoice = async (id) => {
  return await Invoice.findByIdAndDelete(id);
};

exports.getAllInvoices = async () => {
  return await Invoice.find(); //.populate("items.item_id");
};
