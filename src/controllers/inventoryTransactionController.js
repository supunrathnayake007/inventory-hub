// controllers/inventoryTransactionController.js
const inventoryTransactionService = require("../services/inventoryTransactionService");

exports.createInventoryTransaction = async (req, res) => {
  try {
    const transaction =
      await inventoryTransactionService.createInventoryTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
