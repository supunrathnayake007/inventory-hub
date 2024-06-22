// services/invoiceService.js
const Invoice = require("../models/Invoice");
const Item = require("../models/Item");
const inventoryTransactionService = require("./inventoryTransactionService");
const logChanges = require("../middleware/logChanges");
const { verifyToken } = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { calculateInvoiceAmounts } = require("../utils/invoiceCalculations");

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

  //validate system function access permission
  const functions = decoded.functions;
  if (!functions) {
    throw new Error(
      "Access Denied - No system functions assigned to the user."
    );
  }
  if (!functions.includes("invoice-create")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await Invoice.startSession();
  session.startTransaction();

  try {
    const invoice_number = await generateInvoiceNumber();

    const itemsWithPricesPromises = invoiceData.items.map(async (item) => {
      const objectItemId = new ObjectId(item.item_id);
      const itemDetails = await Item.findById(objectItemId);
      const item_price = itemDetails?.price;
      return {
        ...item,
        price: item_price,
        //finalPrice: calculateItemFinalPrice({ ...item, price: item_price }),
      };
    });

    const itemsWithCalculatedValues = await Promise.all(
      itemsWithPricesPromises
    );

    const {
      total_amount,
      item_discount_total,
      item_addon_total,
      final_amount_fixed,
    } = calculateInvoiceAmounts(itemsWithCalculatedValues, invoiceData);

    const invoice = new Invoice({
      ...invoiceData,
      items: itemsWithCalculatedValues,
      invoice_number,
      total_amount,
      item_discount_total,
      item_addon_total,
      final_amount_fixed,
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

  //validate system function access permission
  const functions = decoded.functions;
  if (!functions) {
    throw new Error(
      "Access Denied - No system functions assigned to the user."
    );
  }
  if (!functions.includes("invoice-update")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingInvoice = await Invoice.findById(id).session(session);
    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }
    // Perform calculations on invoiceData items
    const itemsWithCalculatedValues = invoiceData.items.map((item) => ({
      ...item,
      //finalPrice: calculateItemFinalPrice(item),
    }));
    const fieldsToCheck = [
      "invoice_discount_percentage",
      "invoice_discount_value",
      "invoice_addon_percentage",
      "invoice_addon_value",
    ];
    const updatedInvoiceData = { ...invoiceData };

    fieldsToCheck.forEach((field) => {
      if (isNaN(invoiceData[field])) {
        updatedInvoiceData[field] = existingInvoice[field];
      }
    });

    //const invoiceWithmisingdata
    const {
      total_amount,
      item_discount_total,
      item_addon_total,
      final_amount_fixed,
    } = calculateInvoiceAmounts(itemsWithCalculatedValues, updatedInvoiceData);

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        ...invoiceData,
        total_amount,
        item_discount_total,
        item_addon_total,
        final_amount_fixed,
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

  //validate system function access permission
  const functions = decoded.functions;
  if (!functions) {
    throw new Error(
      "Access Denied - No system functions assigned to the user."
    );
  }
  if (!functions.includes("invoice-delete")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

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
};
