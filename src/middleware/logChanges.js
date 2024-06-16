const ChangeLog = require("../models/system/ChangeLog");

const logChanges = async (document, operation, userId, changes) => {
  const changeLog = new ChangeLog({
    document_id: document._id,
    collection_name: document.constructor.modelName,
    user_id: userId,
    operation,
    changes,
    timestamp: Date.now(),
  });
  await changeLog.save();
};

module.exports = logChanges;
