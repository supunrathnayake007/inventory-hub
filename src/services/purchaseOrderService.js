const PurchaseOrder = require("../models/PurchaseOrder");
const logChanges = require("../middleware/logChanges");
const { verifyToken } = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.getPurchaseOrderById = async (id) => {
  return await PurchaseOrder.findById(id).exec();
};

exports.getAllPurchaseOrders = async () => {
  return await PurchaseOrder.find().exec();
};

exports.createPurchaseOrder = async (PurchaseOrderData) => {
  const token = PurchaseOrderData.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectId = new ObjectId(userId);

  const purchaseOrder = new PurchaseOrder({
    ...PurchaseOrderData,
    created_by: objectId,
  });
  await purchaseOrder.save();
  return purchaseOrder;
};

exports.updatePurchaseOrder = async (id, PurchaseOrderData) => {
  const token = PurchaseOrderData.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectUserId = new ObjectId(userId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingPurchaseOrder = await PurchaseOrder.findById(id).session(
      session
    );
    if (!existingPurchaseOrder) {
      throw new Error("Purchase Order not found");
    }

    const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        $set: PurchaseOrderData,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true, session }
    );

    const changes = {};
    for (const key in PurchaseOrderData) {
      if (
        PurchaseOrderData[key] !== existingPurchaseOrder[key] &&
        key !== "token"
      ) {
        changes[key] = {
          old: existingPurchaseOrder[key],
          new: PurchaseOrderData[key],
        };
      }
    }

    await logChanges(updatedPurchaseOrder, "update", objectUserId, changes);
    await session.commitTransaction();
    session.endSession();
    return updatedPurchaseOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.deletePurchaseOrder = async (id, data) => {
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
    const PurchaseOrderToDelete = await PurchaseOrder.findById(id).session(
      session
    );
    if (!PurchaseOrderToDelete) {
      throw new Error("Purchase Order not found");
    }
    await PurchaseOrder.findByIdAndDelete(id).session(session);
    const changes = { PurchaseOrderToDelete };
    await logChanges(PurchaseOrderToDelete, "delete", objectUserId, changes);

    await session.commitTransaction();
    session.endSession();
    return PurchaseOrderToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
