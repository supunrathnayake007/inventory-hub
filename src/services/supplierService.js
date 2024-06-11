// services/supplierService.js
const Supplier = require("../models/Supplier");

exports.createSupplier = async (supplierData) => {
  return await Supplier.create(supplierData);
};

exports.getAllSuppliers = async () => {
  return await Supplier.find();
};

exports.updateSupplier = async (id, updatedData) => {
  return await Supplier.findByIdAndUpdate(id, updatedData, { new: true });
};

exports.deleteSupplier = async (id) => {
  await Supplier.findByIdAndDelete(id);
};

exports.getSupplierById = async (id) => {
  return await Supplier.findById(id);
};
