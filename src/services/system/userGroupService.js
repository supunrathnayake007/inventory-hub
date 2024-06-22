const UserGroup = require("../../models/system/UserGroup");
const logChanges = require("../../middleware/logChanges");
const { verifyToken } = require("../../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.createUserGroup = async (data) => {
  const token = data.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;
  const objectUserId = new ObjectId(userId);

  const userGroup = new UserGroup({ ...data, created_by: objectUserId });
  await userGroup.save();
  return userGroup;
};

exports.updateUserGroup = async (id, data) => {
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
    const existingUserGroup = await UserGroup.findById(id).session(session);
    if (!existingUserGroup) {
      throw new Error("UserGroup not found");
    }
    const updatedUserGroup = await UserGroup.findByIdAndUpdate(
      id,
      {
        $set: data,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true, session }
    );

    const changes = {};
    for (const key in data) {
      if (data[key] !== existingUserGroup[key] && key !== "token") {
        changes[key] = { old: existingUserGroup[key], new: data[key] };
      }
    }

    await logChanges(updatedUserGroup, "update", objectUserId, changes);
    await session.commitTransaction();
    session.endSession();
    return updatedUserGroup;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.deleteUserGroup = async (id, data) => {
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
    const userGroupToDelete = await UserGroup.findById(id).session(session);
    if (!userGroupToDelete) {
      throw new Error("User Group not found");
    }
    await UserGroup.findByIdAndDelete(id).session(session);
    const changes = { userGroupToDelete };
    await logChanges(userGroupToDelete, "delete", objectUserId, changes);

    await session.commitTransaction();
    session.endSession();
    return userGroupToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getUserGroupById = async (id) => {
  return await UserGroup.findById(id);
};

exports.getUserGroups = async () => {
  return await UserGroup.find({});
};
