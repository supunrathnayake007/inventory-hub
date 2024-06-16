// services/itemService.js
const Item = require("../models/Item");
const logChanges = require("../middleware/logChanges");
const { verifyToken } = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// Create a new item
exports.createItem = async (itemData) => {
  const token = itemData.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectUserId = new ObjectId(userId);
  //const item = new Item(itemData);
  const item = new Item({
    ...itemData,
    created_by: objectUserId,
  });
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
  const token = itemData.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectUserId = new ObjectId(userId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingItem = await Item.findById(id).session(session);
    if (!existingItem) {
      throw new Error("Item not found");
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        $set: itemData,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true, session }
    );

    const changes = {};
    for (const key in itemData) {
      if (itemData[key] !== existingItem[key] && key !== "token") {
        changes[key] = { old: existingItem[key], new: itemData[key] };
      }
    }

    await logChanges(updatedItem, "update", objectUserId, changes);
    await session.commitTransaction();
    session.endSession();
    return updatedItem;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Delete an item
exports.deleteItem = async (id, data) => {
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
    const itemToDelete = await Item.findById(id).session(session);
    if (!itemToDelete) {
      throw new Error("Item not found");
    }
    await Item.findByIdAndDelete(id).session(session);
    const changes = { itemToDelete };
    await logChanges(itemToDelete, "delete", objectUserId, changes);

    await session.commitTransaction();
    session.endSession();
    return itemToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
