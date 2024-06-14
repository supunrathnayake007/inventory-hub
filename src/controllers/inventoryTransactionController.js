import inventoryTransactionService from "../services/inventoryTransactionService";
import { ObjectId } from "mongodb";

export const getInventoryTransactions = async (req, res) => {
  try {
    const transactions =
      await inventoryTransactionService.getInventoryTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInventoryTransactionById = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const transaction =
      await inventoryTransactionService.getInventoryTransactionById(objectId);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInventoryTransaction = async (req, res) => {
  try {
    const transaction =
      await inventoryTransactionService.createInventoryTransaction(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateInventoryTransaction = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const updatedTransaction =
      await inventoryTransactionService.updateInventoryTransaction(
        objectId,
        req.body
      );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteInventoryTransaction = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    await inventoryTransactionService.deleteInventoryTransaction(objectId);
    res
      .status(200)
      .json({ message: "inventory transaction deleted successfully" });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
