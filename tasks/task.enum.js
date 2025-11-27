exports.TASK_STATUS = ["pending", "in-progress", "completed"];
exports.TASK_PRIORITY = ["low", "medium", "high"];

exports.TASK_STATUS_ENUM = exports.TASK_STATUS.reduce((acc, val) => {
  acc[val.toUpperCase().replace("-", "_")] = val;
  return acc;
}, {});

exports.TASK_PRIORITY_ENUM = exports.TASK_PRIORITY.reduce((acc, val) => {
  acc[val.toUpperCase().replace("-", "_")] = val;
  return acc;
}, {});
