// Task enums and helper functions for status and priority management.
// Provides enum arrays, Mongoose validation objects, and numeric value mappings for sorting.

exports.TASK_STATUS = ["pending", "in-progress", "completed"];
exports.TASK_PRIORITY = ["low", "medium", "high"];

// Normalizes enum values to uppercase with underscores (e.g., "in-progress" -> "IN_PROGRESS")
const normalizeEnumKey = (value) => {
  return value.toUpperCase().replace(/-/g, "_");
};

// Creates enum object from array (e.g., { PENDING: "pending", IN_PROGRESS: "in-progress" })
const createEnumObject = (array, keyNormalizer = normalizeEnumKey) => {
  return array.reduce((acc, val) => {
    acc[keyNormalizer(val)] = val;
    return acc;
  }, {});
};

// Creates numeric mapping from array index (e.g., { PENDING: 0, IN_PROGRESS: 1 })
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

// Numeric value mappings for efficient database sorting
exports.TASK_PRIORITY_VALUE = createValueMapping(exports.TASK_PRIORITY, (val) =>
  val.toUpperCase()
);
exports.TASK_STATUS_VALUE = createValueMapping(exports.TASK_STATUS);

// Helper functions to get numeric values for sorting
exports.getStatusValue = (status) => {
  return exports.TASK_STATUS_VALUE[normalizeEnumKey(status)] ?? null;
};

exports.getPriorityValue = (priority) => {
  return exports.TASK_PRIORITY_VALUE[normalizeEnumKey(priority)] ?? null;
};

// Normalizes and validates enum value based on type (status or priority)
exports.getNormalizedEnum = (value, flag) => {
  if (flag === "status") {
    return exports.TASK_STATUS_ENUM[normalizeEnumKey(value)] ?? null;
  } else if (flag === "priority") {
    return exports.TASK_PRIORITY_ENUM[normalizeEnumKey(value)] ?? null;
  }
  return null;
};
