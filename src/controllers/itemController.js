// controllers/itemController.js

const itemService = require("../services/itemService");
const { ObjectId } = require("mongodb"); // Import ObjectId from the mongodb package

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const item = await itemService.createItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await itemService.getItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const item = await itemService.getItemById(objectId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const updateData = req.body;
    const item = await itemService.updateItem(objectId, updateData);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const data = req.body;
    const item = await itemService.deleteItem(objectId, data);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
