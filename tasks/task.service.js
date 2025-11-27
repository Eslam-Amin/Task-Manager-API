const ApiError = require("../utils/ApiError");
const {
  getStatusValue,
  getPriorityValue,
  getNormalizedEnum,
  TASK_STATUS_ENUM
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

  /**
   * Create a New Task
   *
   * Creates a new task in the database with calculated priority and status values.
   * Priority and status values are used for efficient sorting.
   *
   * @param {Object} data - Task data
   * @param {string} data.title - Task title
   * @param {string} data.description - Task description
   * @param {string} data.priority - Task priority (low, medium, high)
   * @param {string} data.status - Task status (pending, in-progress, completed)
   * @param {Date} data.dueDate - Task due date
   * @param {string} data.user - User ID who owns the task
   * @returns {Promise<Object>} - Newly created task object
   */
  async createTask(data) {
    const task = new this.TaskModel({
      ...data,
      // Calculate priority value for sorting (0: low, 1: medium, 2: high)
      priorityValue: getPriorityValue(data.priority),
      // Calculate status value for sorting (0: pending, 1: in-progress, 2: completed)
      statusValue: getStatusValue(TASK_STATUS_ENUM.PENDING)
    });
    return await task.save();
  }

  /**
   * Get Tasks with Filtering, Pagination, and Sorting
   *
   * Retrieves tasks for a specific user with support for:
   * - Filtering by status and priority
   * - Full-text search in title and description
   * - Sorting by priority or status (ascending/descending)
   * - Pagination
   *
   * @param {Object} reqQuery - Query parameters from request
   * @param {number} [reqQuery.page=1] - Page number
   * @param {number} [reqQuery.limit=10] - Items per page
   * @param {string} [reqQuery.status] - Filter by status (pending, in-progress, completed)
   * @param {string} [reqQuery.priority] - Filter by priority (low, medium, high)
   * @param {string} [reqQuery.search] - Search text in title and description
   * @param {string} [reqQuery.sort] - Sort field (priority, status)
   * @param {string} [reqQuery.order=desc] - Sort order (asc, desc)
   * @param {string} userId - ID of the user to get tasks for
   * @returns {Promise<Object>} - Object containing tasks, pagination info
   * @returns {Array} tasks - Array of task objects
   * @returns {number} totalTasks - Total number of tasks matching filter
   * @returns {number} page - Current page number
   * @returns {number} limit - Items per page
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
