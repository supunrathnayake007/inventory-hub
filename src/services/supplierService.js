// services/supplierService.js
const Supplier = require("../models/Supplier");
const logChanges = require("../middleware/logChanges");
const { verifyToken } = require("../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.createSupplier = async (supplierData) => {
  const token = supplierData.token;
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
  if (!functions.includes("Supplier-create")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const supplier = new Supplier({
    ...supplierData,
    created_by: objectUserId,
  });
  await supplier.save();
  return supplier;
};

exports.updateSupplier = async (id, updatedData) => {
  const token = updatedData.token;
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
  if (!functions.includes("Supplier-update")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingSupplier = await Supplier.findById(id).session(session);
    if (!existingSupplier) {
      throw new Error("Supplier not found");
    }
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      {
        $set: updatedData,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true, session }
    );

    const changes = {};
    for (const key in updatedData) {
      if (updatedData[key] !== existingSupplier[key] && key !== "token") {
        changes[key] = { old: existingSupplier[key], new: updatedData[key] };
      }
    }

    await logChanges(updatedSupplier, "update", objectUserId, changes);
    await session.commitTransaction();
    session.endSession();
    return updatedSupplier;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.deleteSupplier = async (id, data) => {
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
  if (!functions.includes("Supplier-delete")) {
    throw new Error(
      "Access Denied - User doesn't have permission to perform this function."
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const supplierToDelete = await Supplier.findById(id).session(session);
    if (!supplierToDelete) {
      throw new Error("Supplier not found");
    }
    await Supplier.findByIdAndDelete(id).session(session);
    const changes = { supplierToDelete };
    await logChanges(supplierToDelete, "delete", objectUserId, changes);

    await session.commitTransaction();
    session.endSession();
    return supplierToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getSupplierById = async (id) => {
  return await Supplier.findById(id);
};

exports.getAllSuppliers = async () => {
  return await Supplier.find();
};
