const purchaseOrderService = require("../services/purchaseOrderService");
const { ObjectId } = require("mongodb");

exports.getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(
      objectId
    );
    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" });
    }
    res.status(200).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await purchaseOrderService.getAllPurchaseOrders();
    res.status(200).json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await purchaseOrderService.createPurchaseOrder(
      req.body
    );
    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const updatedPurchaseOrder = await purchaseOrderService.updatePurchaseOrder(
      objectId,
      req.body
    );
    res.status(200).json(updatedPurchaseOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    await purchaseOrderService.deletePurchaseOrder(objectId);
    res.status(200).json({ message: "purchase Order deleted successfully" });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
