// services/categoryService.js
const Category = require("../models/Category");

exports.createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  await category.save();
  return category;
};
