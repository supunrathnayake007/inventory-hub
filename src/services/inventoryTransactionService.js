const InventoryTransaction = require("../models/InventoryTransaction");

exports.createInventoryTransaction = async (inventoryTransactionData) =>
  await InventoryTransaction.create(inventoryTransactionData);

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
