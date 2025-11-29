// Task model schema with text search indexing and user ownership.
// Uses numeric priorityValue and statusValue for efficient sorting.

const mongoose = require("mongoose");
const {
  TASK_STATUS_ENUM,
  TASK_PRIORITY_ENUM,
  TASK_PRIORITY,
  TASK_STATUS,
  TASK_STATUS_VALUE
} = require("./task.enum.js");
const TaskDTO = require("./task.dto");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "task title is required"]
    },
    description: {
      type: String,
      trim: true,
      required: [true, "task description is required"]
    },
    status: {
      type: String,
      trim: true,
      lowercase: true,
      enum: TASK_STATUS_ENUM,
      default: TASK_STATUS_ENUM.PENDING,
      required: [true, "task status is required"]
    },
    priority: {
      type: String,
      trim: true,
      lowercase: true,
      enum: TASK_PRIORITY_ENUM,
      required: [true, "task priority is required"]
    },
    priorityValue: {
      type: Number,
      enum: TASK_PRIORITY.map((_, index) => index), // 0: low, 1: medium, 2: high
      required: [true, "task priority value is required"]
    },
    statusValue: {
      type: Number,
      enum: TASK_STATUS.map((_, index) => index), // 0: pending, 1: in-progress, 2: completed
      default: TASK_STATUS_VALUE.PENDING,
      required: [true, "task status value is required"]
    },
    dueDate: {
      type: Date
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "task must belong to a user"]
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        return TaskDTO.toTaskDTO(ret);
      }
    }
  }
);

// Text index for full-text search (title weighted 3x more than description)
taskSchema.index(
  {
    title: "text",
    description: "text"
  },
  {
    weights: {
      title: 3,
      description: 1
    }
  }
);

// Index on user field for efficient filtering by owner
taskSchema.index({ user: 1 });

module.exports = mongoose.model("Task", taskSchema);
