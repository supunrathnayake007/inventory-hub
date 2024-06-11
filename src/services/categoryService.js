// services/categoryService.js
const Category = require("../models/Category");

exports.createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  await category.save();
  return category;
};
exports.updateCategory = async (id, updateData) => {
  // Find the category by ID and update it with the new data
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

exports.getCategoryById = async (id) => {
  // Find the category by ID
  return await Category.findById(id);
};

exports.deleteCategory = async (id) => {
  // Find the category by ID and delete it
  return await Category.findByIdAndDelete(id);
};

exports.getCategories = async () => {
  // Retrieve all categories
  return await Category.find({});
};
