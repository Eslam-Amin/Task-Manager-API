const mongoose = require("mongoose");
const { TASK_STATUS_ENUM, TASK_PRIORITY_ENUM } = require("./task.enum.js");
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

module.exports = mongoose.model("Task", taskSchema);
