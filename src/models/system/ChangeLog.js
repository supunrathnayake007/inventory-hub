const mongoose = require("mongoose");

const changeLogSchema = new mongoose.Schema({
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  collection_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  operation: {
    type: String,
    enum: ["update", "delete"],
    required: true,
  },
  changes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.ChangeLog || mongoose.model("ChangeLog", changeLogSchema);
