// services/system/userService.js
const User = require("../../models/system/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
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

exports.getUserById = async (id) => {
  return await User.findById(id).select("-password");
};
