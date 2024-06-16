// controllers/categoryController.js
const categoryService = require("../services/categoryService");
const { ObjectId } = require("mongodb"); // Import ObjectId from the mongodb package

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.query; // Get the category ID from the query parameters
    const updateData = req.body; // Get the update data from the request body

    const objectId = new ObjectId(id);
    // Update the category using the service
    const updatedCategory = await categoryService.updateCategory(
      objectId,
      updateData
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.query; // Get the category ID from the query parameters
    const objectId = new ObjectId(id);
    // Fetch the category using the service
    const category = await categoryService.getCategoryById(objectId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.query; // Get the category ID from the query parameters
    const objectId = new ObjectId(id);
    // Delete the category using the service
    const data = req.body;
    const deletedCategory = await categoryService.deleteCategory(
      objectId,
      data
    );

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
