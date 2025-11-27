class TaskController {
  constructor() {
    this.taskService = require("./task.service");
  }

  async getAllTasks(req, res) {
    try {
      const filter = { user: req.user._id };
      const tasks = await this.taskService.getTasks(filter);
      res.status(200).json({ data: tasks });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Creates a new task
   * @param {Object} req.body - Task data to create
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Newly created task
   * @throws {Error} - If the task is not created successfully
   */
  async createTask(req, res) {
    try {
      const taskData = { ...req.body, user: req.user._id };
      const newTask = await this.taskService.createTask(taskData);
      res.status(201).json({
        data: newTask
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Retrieves a task by id and user id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - Task that matches the given id and user id
   * @throws {Error} - If the task is not found
   */
  async getTask(req, res) {
    try {
      const taskId = req.params.id;
      const task = await this.taskService.getTaskById(taskId, req.user._id);
      res.status(200).json({ data: task });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Updates a task by id and user id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - Updated task
   * @throws {Error} - If the task is not found or updated successfully
   */
  async updateTask(req, res) {
    try {
      const taskId = req.params.id;
      const updateData = req.body;
      const updatedTask = await this.taskService.updateTask(
        taskId,
        req.user._id,
        updateData
      );
      res.status(200).json({ data: updatedTask });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * Deletes a task by id and user id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Promise<Object>} - No return value, task is deleted if found
   * @throws {Error} - If the task is not found or deleted successfully
   */
  async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      await this.taskService.deleteTask(taskId, req.user._id);
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new TaskController();
