// Base enum arrays
exports.TASK_STATUS = ["pending", "in-progress", "completed"];
exports.TASK_PRIORITY = ["low", "medium", "high"];

// Helper functions
const normalizeEnumKey = (value) => {
  return value.toUpperCase().replace(/-/g, "_");
};

const createEnumObject = (array, keyNormalizer = normalizeEnumKey) => {
  return array.reduce((acc, val) => {
    acc[keyNormalizer(val)] = val;
    return acc;
  }, {});
};

const createValueMapping = (array, keyNormalizer = normalizeEnumKey) => {
  return array.reduce((acc, val, index) => {
    acc[keyNormalizer(val)] = index;
    return acc;
  }, {});
};

// Enum objects for Mongoose schema validation
exports.TASK_STATUS_ENUM = createEnumObject(exports.TASK_STATUS);
exports.TASK_PRIORITY_ENUM = createEnumObject(exports.TASK_PRIORITY, (val) =>
  val.toUpperCase()
);

// Value mappings for numeric sorting
exports.TASK_PRIORITY_VALUE = createValueMapping(exports.TASK_PRIORITY, (val) =>
  val.toUpperCase()
);
exports.TASK_STATUS_VALUE = createValueMapping(exports.TASK_STATUS);

// Helper functions
exports.getStatusValue = (status) => {
  return exports.TASK_STATUS_VALUE[normalizeEnumKey(status)] ?? null;
};

exports.getPriorityValue = (priority) => {
  return exports.TASK_PRIORITY_VALUE[normalizeEnumKey(priority)] ?? null;
};

exports.getNormalizedEnum = (value, flag) => {
  if (flag === "status") {
    return exports.TASK_STATUS_ENUM[normalizeEnumKey(value)] ?? null;
  } else if (flag === "priority") {
    return exports.TASK_PRIORITY_ENUM[normalizeEnumKey(value)] ?? null;
  }
  return null;
};
