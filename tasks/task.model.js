const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { TASK_STATUS } = require("../utils/constants");

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
      enum: TASK_STATUS,
      required: [true, "task status is required"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "task must belong to a user"]
    }
  },
  { timestamps: true }
);

taskSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", taskSchema);
