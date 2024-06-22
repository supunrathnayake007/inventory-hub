const systemFunctionService = require("../../services/system/systemFunctionService");
const { ObjectId } = require("mongodb"); // Import ObjectId from the mongodb package

exports.createSystemFunction = async (req, res) => {
  try {
    const systemFunction = await systemFunctionService.createSystemFunction(
      req.body
    );
    res.status(201).json(systemFunction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSystemFunction = async (req, res) => {
  try {
    const { id } = req.query;
    const updateData = req.body;
    const objectId = new ObjectId(id);
    const updatedSystemFunction =
      await systemFunctionService.updateSystemFunction(objectId, updateData);

    if (!updatedSystemFunction) {
      return res.status(404).json({ message: "System Function not found" });
    }
    res.status(200).json(updatedSystemFunction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSystemFunction = async (req, res) => {
  try {
    const { id } = req.query;
    const objectId = new ObjectId(id);
    const data = req.body;
    const deletedSystemFunction =
      await systemFunctionService.deleteSystemFunction(objectId, data);
    if (!deletedSystemFunction) {
      return res.status(404).json({ message: "System Function not found" });
    }
    res.status(200).json({ message: "System Function deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getSystemFunctions = async (req, res) => {
  try {
    const SystemFunction = await systemFunctionService.getSystemFunctions();
    res.status(200).json(SystemFunction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
