// services/system/userService.js
const User = require("../../models/system/User");
const jwt = require("jsonwebtoken");
const logChanges = require("../../middleware/logChanges");
const { verifyToken } = require("../../middleware/authMiddleware");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const generateToken = (user) => {
  const functions = user.functions || "";
  return jwt.sign(
    { id: user._id, username: user.username, functions: functions },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

exports.register = async (userData) => {
  const user = new User(userData);
  await user.save();
  const token = generateToken(user);
  return { user, token };
};

exports.login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid username or password");
  }
  const token = generateToken(user);
  return { user, token };
};

exports.update = async (id, data) => {
  const token = data.token;
  if (!token) {
    throw new Error("No User Token provided");
  }
  const decoded = await verifyToken(token); // Implement verifyToken to decode the token
  const userId = decoded.id;

  //validate system function access permission
  // const functions = decoded.functions;
  // if(!functions){
  //   throw new Error("Access Denied");
  // }
  // if(!functions.includes("ManageUser")){
  //   throw new Error("Access Denied");
  // }

  const objectUserId = new ObjectId(userId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingUser = await User.findById(id).session(session);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: data,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true, session }
    );
    const changes = {};
    for (const key in data) {
      if (data[key] !== existingUser[key] && key !== "token") {
        if (key === "password") {
          changes[key] = { old: "password changed", new: "password changed" };
        } else {
          changes[key] = { old: existingUser[key], new: data[key] };
        }
      }
    }
    await logChanges(updatedUser, "update", objectUserId, changes);
    await session.commitTransaction();
    session.endSession();
    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.getUserById = async (id) => {
  return await User.findById(id).select("-password");
};
