const ApiError = require("../utils/ApiError");
const {
  getStatusValue,
  getPriorityValue,
  getNormalizedEnum
} = require("./task.enum");

class TaskService {
  /**
   * Constructor for TaskService class
   * Requires no parameters
   * Sets the TaskModel property to the Task model
   */
  constructor() {
    this.TaskModel = require("./task.model");
  }

  /**
   * Create a new task
   * @param {Object} data - Task data
   * @returns {Promise<Task>} - Newly created task
   */
  async createTask(data) {
    const task = new this.TaskModel({
      ...data,
      priorityValue: getPriorityValue(data.priority),
      statusValue: getStatusValue("pending")
    });
    return await task.save();
  }

  /**
   * Retrieves all tasks that match the given filter
   * @param {Object} [filter] - Filter to apply to the tasks
   * @returns {Promise<Task[]>} - All tasks that match the filter
   */
  async getTasks(reqQuery = {}, userId) {
    const page = parseInt(reqQuery.page) || 1;
    const limit = parseInt(reqQuery.limit) || 10;
    const skip = (page - 1) * limit;
    let filter = { user: userId };
    let sortOption = { createdAt: -1 };
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
      sortOption = {
        [`${reqQuery.sort.toLowerCase()}Value`]:
          reqQuery?.order?.toLowerCase() === "asc" ? 1 : -1
      };
    }

    const tasks = await this.TaskModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    const totalTasks = await this.TaskModel.countDocuments(filter);
    return { tasks, totalTasks, page, limit };
  }

  /**
   * Retrieves a task by id and user id
   * @param {string} id - Task id
   * @param {string} userId - User id
   * @returns {Promise<Task>} - Task that matches the given id and user id
   * @throws {Error} - If the task is not found
   */
  async getTaskById(id, userId) {
    const task = await this.TaskModel.findById(id);
    if (!task) {
      throw ApiError.notFound(`Task is not found`);
    } else if (task.user.toString() !== userId) {
      throw ApiError.forbidden(`You are not allowed to access this task`);
    }
    return task;
  }

  /**
   * Updates a task by id and user id
   * @param {string} id - Task id
   * @param {string} userId - User id
   * @param {Object} data - Task data to update
   * @returns {Promise<Task>} - Updated task
   * @throws {Error} - If the task is not found
   */
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

  /**
   * Deletes a task by id and user id
   * @param {string} id - Task id
   * @param {string} userId - User id
   * @returns {Promise<void>} - No return value, task is deleted if found
   * @throws {Error} - If the task is not found
   */
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
