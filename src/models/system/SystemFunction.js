const mongoose = require("mongoose");
const systemFunctionSchema = new mongoose({
  functionName: { type: String, require: true, unique: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports =
  mongoose.models.SystemFunction ||
  mongoose.model("SystemFunction", systemFunctionSchema);
