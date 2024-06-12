const PurchaseOrder = require("../models/PurchaseOrder");

exports.getPurchaseOrderById = async (id) => {
  return await PurchaseOrder.findById(id).exec();
};

exports.getAllPurchaseOrders = async () => {
  return await PurchaseOrder.find().exec();
};

exports.createPurchaseOrder = async (data) => {
  return await PurchaseOrder.create(data);
};

exports.updatePurchaseOrder = async (id, data) => {
  return await PurchaseOrder.findByIdAndUpdate(id, data, { new: true }).exec();
};

exports.deletePurchaseOrder = async (id) => {
  return await PurchaseOrder.findByIdAndDelete(id).exec();
};
