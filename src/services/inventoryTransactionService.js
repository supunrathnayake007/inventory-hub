const InventoryTransaction = require("../models/InventoryTransaction");
const Item = require("../models/Item");
const logChanges = require("../middleware/logChanges");
const { verifyToken } = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// then transaction create base on the type item quantity increase or decrease
exports.createInventoryTransaction = async (transactionData) => {
  const token = transactionData.token;
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
  if (!functions.includes("InventoryTransaction-create")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await InventoryTransaction.startSession();
  session.startTransaction();

  try {
    const transaction = new InventoryTransaction({
      ...transactionData,
      created_by: objectUserId,
    });
    await transaction.save({ session });

    // Update item quantity based on transaction type
    const item = await Item.findById(transaction.item_id).session(session);
    if (!item) {
      throw new Error("Item not found");
    }

    switch (transaction.transaction_type) {
      case "purchase":
        item.quantity_in_stock += transaction.quantity;
        break;
      case "sale":
        item.quantity_in_stock -= transaction.quantity;
        break;
      case "adjustment":
        item.quantity_in_stock += transaction.quantity; // Adjust based on business logic
        break;
      default:
        throw new Error("Invalid transaction type");
    }

    await item.save({ session });
    await session.commitTransaction();
    session.endSession();
    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getInventoryTransactions = async () =>
  await InventoryTransaction.find();

exports.getInventoryTransactionById = async (id) =>
  await InventoryTransaction.findById(id);

exports.updateInventoryTransaction = async (id, inventoryTransactionData) => {
  const token = inventoryTransactionData.token;
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
  if (!functions.includes("InventoryTransaction-update")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingInventoryTransaction = await InventoryTransaction.findById(
      id
    ).session(session);
    if (!existingInventoryTransaction) {
      throw new Error("Inventory Transaction not found");
    }

    const updatedInventoryTransaction =
      await InventoryTransaction.findByIdAndUpdate(
        id,
        {
          $set: inventoryTransactionData,
          $inc: { __v: 1 },
        },
        { new: true, runValidators: true, session }
      );

    const changes = {};
    for (const key in inventoryTransactionData) {
      if (
        inventoryTransactionData[key] !== existingInventoryTransaction[key] &&
        key !== "token"
      ) {
        changes[key] = {
          old: existingInventoryTransaction[key],
          new: inventoryTransactionData[key],
        };
      }
    }
    await logChanges(
      updatedInventoryTransaction,
      "update",
      objectUserId,
      changes
    );
    await session.commitTransaction();
    session.endSession();
    return updatedInventoryTransaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.deleteInventoryTransaction = async (id, data) => {
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
  if (!functions.includes("InventoryTransaction-delete")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const InventoryTransactionToDelete = await InventoryTransaction.findById(
      id
    ).session(session);
    if (!InventoryTransactionToDelete) {
      throw new Error("Inventory Transaction not found");
    }
    await InventoryTransaction.findByIdAndDelete(id).session(session);
    const changes = { InventoryTransactionToDelete };
    await logChanges(
      InventoryTransactionToDelete,
      "delete",
      objectUserId,
      changes
    );

    await session.commitTransaction();
    session.endSession();
    return InventoryTransactionToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
