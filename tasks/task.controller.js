const TaskDto = require("./task.dto");
const taskService = require("./task.service");

class TaskController {
  async getAllTasks(req, res, next) {
    try {
      const filter = { user: req.userId };
      const tasks = await taskService.getTasks(filter);
      res
        .status(200)
        .json({ message: "Tasks fetched successfully", data: tasks });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new task
   * @param {Object} req.body - Task data to create
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Newly created task
   * @throws {Error} - If the task is not created successfully
   */
  async createTask(req, res, next) {
    try {
      const taskData = { ...req.body, user: req.userId };
      const newTask = await taskService.createTask(taskData);
      res.status(201).json({
        message: "Task created successfully",
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a task by id and user id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - Task that matches the given id and user id
   * @throws {Error} - If the task is not found
   */
  async getTask(req, res, next) {
    try {
      const taskId = req.params.id;
      const task = await taskService.getTaskById(taskId, req.userId);
      res
        .status(200)
        .json({ message: "Task updated successfully", data: task });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a task by id and user id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - Updated task
   * @throws {Error} - If the task is not found or updated successfully
   */
  async updateTask(req, res, next) {
    try {
      const taskId = req.params.id;
      const updateData = req.body;
      const updatedTask = await taskService.updateTask(
        taskId,
        req.userId,
        updateData
      );
      res
        .status(200)
        .json({ message: "Task updated successfully", data: updatedTask });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes a task by id and user id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - No return value, task is deleted if found
   * @throws {Error} - If the task is not found or deleted successfully
   */
  async deleteTask(req, res, next) {
    try {
      const taskId = req.params.id;
      await taskService.deleteTask(taskId, req.userId);
      res.status(200).json({ message: "Task deleted successfully", data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
