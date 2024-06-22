const SystemFunction = require("../../models/system/SystemFunction");
const logChanges = require("../../middleware/logChanges");
const { verifyToken } = require("../../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.getSystemFunctions = async () => {
  const functions = [
    "ManageUser",
    "ManageUserGroup",
    "invoice-create",
    "invoice-update",
    "invoice-delete",
    "InventoryTransaction-create",
    "InventoryTransaction-update",
    "InventoryTransaction-delete",
    "PurchaseOrder-create",
    "PurchaseOrder-update",
    "PurchaseOrder-delete",
    "item-create",
    "item-update",
    "item-delete",
    "Category-create",
    "Category-update",
    "Category-delete",
    "Supplier-create",
    "Supplier-update",
    "Supplier-delete",
  ];
  return functions;
};

// exports.createSystemFunction = async (systemFunctionData) => {
//   const token = systemFunctionData.token;
//   if (!token) {
//     throw new Error("No User Token provided");
//   }
//   const decoded = await verifyToken(token); // Implement verifyToken to decode the token
//   const userId = decoded.id;
//   const objectUserId = new ObjectId(userId);

//   const systemFunction = new SystemFunction({
//     ...systemFunctionData,
//     created_by: objectUserId,
//   });
//   await systemFunction.save();
//   return systemFunction;
// };

// exports.updateSystemFunction = async (id, systemFunctionData) => {
//   const token = systemFunctionData.token;
//   if (!token) {
//     throw new Error("No User Token provided");
//   }
//   const decoded = await verifyToken(token); // Implement verifyToken to decode the token
//   const userId = decoded.id;
//   const objectUserId = new ObjectId(userId);
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const existingSystemFunction = await SystemFunction.findById(id).session(
//       session
//     );
//     if (!existingSystemFunction) {
//       throw new Error("System Function not found");
//     }

//     const updatedSystemFunction = await SystemFunction.findByIdAndUpdate(
//       id,
//       {
//         $set: systemFunctionData,
//         $inc: { __v: 1 },
//       },
//       { new: true, runValidators: true, session }
//     );
//     const changes = {};
//     for (const key in systemFunctionData) {
//       if (
//         systemFunctionData[key] !== existingSystemFunction[key] &&
//         key !== "token"
//       ) {
//         changes[key] = {
//           old: existingSystemFunction[key],
//           new: systemFunctionData[key],
//         };
//       }
//     }
//     await logChanges(updatedSystemFunction, "update", objectUserId, changes);
//     await session.commitTransaction();
//     session.endSession();
//     return updatedSystemFunction;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

// exports.deleteSystemFunction = async (id, data) => {
//   const token = data.token;
//   if (!token) {
//     throw new Error("No User Token provided");
//   }
//   const decoded = await verifyToken(token); // Implement verifyToken to decode the token
//   const userId = decoded.id;
//   const objectUserId = new ObjectId(userId);
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const systemFunctionToDelete = await SystemFunction.findById(id).session(
//       session
//     );
//     if (!systemFunctionToDelete) {
//       throw new Error("system Function not found");
//     }
//     await SystemFunction.findByIdAndDelete(id).session(session);
//     const changes = { systemFunctionToDelete };
//     await logChanges(systemFunctionToDelete, "delete", objectUserId, changes);

//     await session.commitTransaction();
//     session.endSession();
//     return systemFunctionToDelete;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
