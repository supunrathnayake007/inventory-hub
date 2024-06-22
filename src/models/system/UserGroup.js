const mongoose = require("mongoose");
const userGroupSchema = new mongoose({
  userGroupName: { type: String, require: true, unique: true },
  functions: [
    {
      _id: false,
      function_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SystemFunction",
        required: true,
      },
    },
  ],
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
  mongoose.models.UserGroup || mongoose.model("UserGroup", userGroupSchema);
