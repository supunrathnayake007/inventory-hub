const InventoryTransaction = require("../models/InventoryTransaction");

const Item = require("../models/Item");

// then transaction create base on the type item quantity increase or decrease
exports.createInventoryTransaction = async (transactionData) => {
  const session = await InventoryTransaction.startSession();
  session.startTransaction();

  try {
    const transaction = new InventoryTransaction(transactionData);
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

exports.updateInventoryTransaction = async (id, inventoryTransactionData) =>
  await InventoryTransaction.findByIdAndUpdate(id, inventoryTransactionData, {
    new: true,
  });

exports.deleteInventoryTransaction = async (id) =>
  await InventoryTransaction.findByIdAndDelete(id);
