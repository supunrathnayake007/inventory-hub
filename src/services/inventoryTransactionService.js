// services/inventoryTransactionService.js
const InventoryTransaction = require("../models/InventoryTransaction");

exports.createInventoryTransaction = async (transactionData) => {
  const transaction = new InventoryTransaction(transactionData);
  await transaction.save();
  return transaction;
};
