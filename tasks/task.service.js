// Task service handles business logic for task operations.
// Enforces user ownership and calculates numeric values for efficient sorting.

const ApiError = require("../utils/ApiError");
const {
  getStatusValue,
  getPriorityValue,
  getNormalizedEnum
} = require("./task.enum");

class TaskService {
  /**
   * Constructor for TaskService class
   *
   * Initializes the TaskService by loading the Task model.
   * Requires no parameters.
   */
  constructor() {
    this.TaskModel = require("./task.model");
  }

  // Creates new task with calculated priority value for sorting (0=low, 1=medium, 2=high)
  async createTask(data) {
    const task = new this.TaskModel({
      ...data,
      // Calculate priority value for sorting (0: low, 1: medium, 2: high)
      priorityValue: getPriorityValue(data.priority)
    });
    return await task.save();
  }

  // Retrieves tasks with filtering, pagination, and sorting.
  // Supports: status/priority filters, full-text search, sorting by priority/status/dueDate
  async getTasks(userId, reqQuery = {}) {
    const page = parseInt(reqQuery.page) || 1;
    const limit = parseInt(reqQuery.limit) || 10;
    const skip = (page - 1) * limit;
    let filter = { user: userId };
    let sortOption = { dueDate: -1 };

    if (reqQuery.status) {
      filter.status = getNormalizedEnum(reqQuery.status, "status");
    }
    if (reqQuery.priority) {
      filter.priority = getNormalizedEnum(reqQuery.priority, "priority");
    }
    if (reqQuery.search) {
      filter["$text"] = { $search: reqQuery.search.trim() };
    }
    if (reqQuery.sort) {
      const order = reqQuery.order?.toLowerCase() === "asc" ? 1 : -1;
      if (reqQuery.sort.toLowerCase() === "duedate")
        sortOption = { dueDate: order };
      else sortOption = { [`${reqQuery.sort.toLowerCase()}Value`]: order };
    }

    const tasks = await this.TaskModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    const totalTasks = await this.TaskModel.countDocuments(filter);
    return { tasks, totalTasks, page, limit };
  }

  // Retrieves task by ID and verifies user ownership
  async getTaskById(id, userId) {
    const task = await this.TaskModel.findById(id);
    if (!task) {
      throw ApiError.notFound(`Task is not found`);
    } else if (task.user.toString() !== userId) {
      throw ApiError.forbidden(`You are not allowed to access this task`);
    }
    return task;
  }

  // Updates task and recalculates priority/status values if changed. Verifies ownership.
  async updateTask(id, userId, data) {
    if (data.priority) {
      data.priorityValue = getPriorityValue(data.priority);
    }
    if (data.status) {
      data.statusValue = getStatusValue(data.status);
    }
    const task = await this.TaskModel.findByIdAndUpdate(id, data, {
      new: true
    });
    if (!task) {
      throw ApiError.notFound(`Task is not found`);
    } else if (task.user.toString() !== userId) {
      throw ApiError.forbidden(`You are not allowed to access this task`);
    }
    return task;
  }

  // Deletes task and verifies user ownership
  async deleteTask(id, userId) {
    const task = await this.TaskModel.findByIdAndDelete(id);
    if (!task) {
      throw ApiError.notFound(`Task is not found`);
    } else if (task.user.toString() !== userId) {
      throw ApiError.forbidden(`You are not allowed to access this task`);
    }
    return;
  }
}

module.exports = new TaskService();
