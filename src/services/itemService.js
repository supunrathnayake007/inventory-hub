// services/itemService.js

const Item = require("../models/Item");

// Create a new item
exports.createItem = async (itemData) => {
  const item = new Item(itemData);
  await item.save();
  return item;
};

// Get all items
exports.getItems = async () => {
  return Item.find();
};

// Get a single item by ID
exports.getItemById = async (id) => {
  return Item.findById(id);
};

// Update an item
exports.updateItem = async (id, itemData) => {
  return Item.findByIdAndUpdate(id, itemData, { new: true });
};

// Delete an item
exports.deleteItem = async (id) => {
  return Item.findByIdAndDelete(id);
};
