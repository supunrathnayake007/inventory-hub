// services/categoryService.js
const Category = require("../models/Category");
const logChanges = require("../middleware/logChanges");
const { verifyToken } = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.createCategory = async (categoryData) => {
  const token = categoryData.token;
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
  if (!functions.includes("Category-create")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const category = new Category({ ...categoryData, created_by: objectUserId });
  await category.save();
  return category;
};
exports.updateCategory = async (id, updateData) => {
  const token = updateData.token;
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
  if (!functions.includes("Category-update")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingCategory = await Category.findById(id).session(session);
    if (!existingCategory) {
      throw new Error("Category not found");
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true, session }
    );

    const changes = {};
    for (const key in updateData) {
      if (updateData[key] !== existingCategory[key] && key !== "token") {
        changes[key] = { old: existingCategory[key], new: updateData[key] };
      }
    }

    await logChanges(updatedCategory, "update", objectUserId, changes);
    await session.commitTransaction();
    session.endSession();
    return updatedCategory;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.deleteCategory = async (id, data) => {
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
  if (!functions.includes("Category-delete")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const categoryToDelete = await Category.findById(id).session(session);
    if (!categoryToDelete) {
      throw new Error("Category not found");
    }
    await Category.findByIdAndDelete(id).session(session);
    const changes = { categoryToDelete };
    await logChanges(categoryToDelete, "delete", objectUserId, changes);

    await session.commitTransaction();
    session.endSession();
    return categoryToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

  // Find the category by ID and delete it
  return await Category.findByIdAndDelete(id);
};

exports.getCategoryById = async (id) => {
  // Find the category by ID
  return await Category.findById(id);
};

exports.getCategories = async () => {
  // Retrieve all categories
  return await Category.find({});
};
