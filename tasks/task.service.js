const ApiError = require("../utils/ApiError");

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
    const task = new this.TaskModel(data);
    return await task.save();
  }

  /**
   * Retrieves all tasks that match the given filter
   * @param {Object} [filter] - Filter to apply to the tasks
   * @returns {Promise<Task[]>} - All tasks that match the filter
   */
  async getTasks(filter = {}) {
    return await this.TaskModel.find(filter);
  }

  /**
   * Retrieves a task by id and user id
   * @param {string} id - Task id
   * @param {string} userId - User id
   * @returns {Promise<Task>} - Task that matches the given id and user id
   * @throws {Error} - If the task is not found
   */
  async getTaskById(id, userId) {
    const task = await this.TaskModel.findOne({ _id: id, user: userId });
    if (!task) {
      throw ApiError.notFound(`Task is not found`);
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
    const task = await this.TaskModel.findOneAndUpdate(
      { _id: id, user: userId },
      data,
      {
        new: true
      }
    );
    if (!task) {
      throw ApiError.notFound(`Task is not found`);
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
    const task = await this.TaskModel.findOneAndDelete({
      _id: id,
      user: userId
    });
    if (!task) {
      throw ApiError.notFound(`Task is not found`);
    }
    return;
  }
}

module.exports = new TaskService();
