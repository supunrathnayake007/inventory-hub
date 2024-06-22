// controllers/system/userController.js
const userService = require("../../services/system/userService");
const { ObjectId } = require("mongodb");

exports.register = async (req, res) => {
  try {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await userService.login(username, password);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;
    const objectId = new ObjectId(id);
    const user = await userService.update(objectId, data);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const user = await userService.getUserById(objectId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
