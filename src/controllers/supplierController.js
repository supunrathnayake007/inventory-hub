// controllers/supplierController.js
const supplierService = require("../services/supplierService");
const { ObjectId } = require("mongodb"); // Import ObjectId from the mongodb package

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const updatedSupplier = await supplierService.updateSupplier(
      objectId,
      req.body
    );
    res.status(200).json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    await supplierService.deleteSupplier(objectId);
    res.status(200).json({ message: "supplier deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const supplier = await supplierService.getSupplierById(objectId);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
