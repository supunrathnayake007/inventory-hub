const userGroupService = require("../../services/system/userGroupService");
const { ObjectId } = require("mongodb"); // Import ObjectId from the mongodb package

exports.createUserGroup = async (req, res) => {
  try {
    const userGroup = await userGroupService.createUserGroup(req.body);
    res.status(201).json(userGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserGroup = async (req, res) => {
  try {
    const { id } = req.query;
    const updateData = req.body;
    const objectId = new ObjectId(id);
    const updateUserGroup = await userGroupService.updateUserGroup(
      objectId,
      updateData
    );
    if (!updateUserGroup) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updateUserGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserGroup = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const deletedUserGroup = await userGroupService.deleteUserGroup(
      objectId,
      data
    );
    if (!deletedUserGroup) {
      return res.status(404).json({ message: "User Group not found" });
    }
    res.status(200).json({ message: "User Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userGroups = await userGroupService.getUserGroups();
    res.status(200).json(userGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserGroupById = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const userGroup = await userGroupService.getUserGroupById(objectId);
    if (!userGroup) {
      return res.status(404).json({ message: "User Group not found" });
    }
    res.status(200).json(userGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
