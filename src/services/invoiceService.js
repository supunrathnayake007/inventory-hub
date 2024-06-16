// services/invoiceService.js
const Invoice = require("../models/Invoice");
const inventoryTransactionService = require("./inventoryTransactionService");
const logChanges = require("../middleware/logChanges");
const { verifyToken } = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

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
  const token = invoiceData.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectUserId = new ObjectId(userId);

  const session = await Invoice.startSession();
  session.startTransaction();

  try {
    const invoice_number = await generateInvoiceNumber();
    const invoice = new Invoice({
      ...invoiceData,
      invoice_number,
      created_by: objectUserId,
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
      await inventoryTransactionService.createInventoryTransaction({
        ...transactionData,
        token,
      });
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
exports.getAllInvoices = async () => {
  return await Invoice.find(); //.populate("items.item_id");
};

exports.getInvoiceById = async (id) => {
  return await Invoice.findById(id); //.populate("items.item_id");
};

exports.updateInvoice = async (id, invoiceData) => {
  const token = invoiceData.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectUserId = new ObjectId(userId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingInvoice = await Invoice.findById(id).session(session);
    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        $set: invoiceData,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true, session }
    );
    const changes = {};
    for (const key in invoiceData) {
      if (invoiceData[key] !== existingInvoice[key] && key !== "token") {
        changes[key] = { old: existingInvoice[key], new: invoiceData[key] };
      }
    }
    //here we can write a method to validate update recode with inventory transaction as well
    //
    await logChanges(updatedInvoice, "update", objectUserId, changes);
    await session.commitTransaction();
    session.endSession();
    return updatedInvoice;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.deleteInvoice = async (id, data) => {
  const token = data.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectUserId = new ObjectId(userId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoiceToDelete = await Invoice.findById(id).session(session);
    if (!invoiceToDelete) {
      throw new Error("Item not found");
    }

    await Item.findByIdAndDelete(id).session(session);
    const changes = { invoiceToDelete };
    await logChanges(invoiceToDelete, "delete", objectUserId, changes);

    await session.commitTransaction();
    session.endSession();
    return invoiceToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

  return await Invoice.findByIdAndDelete(id);
};
