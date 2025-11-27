/**
 * Task Controller
 *
 * This module handles HTTP requests related to task management.
 * It processes requests, calls the task service, and sends responses.
 *
 * @module tasks/task.controller
 */

const taskService = require("./task.service");

/**
 * Task Controller Class
 *
 * Handles HTTP requests for task operations such as creating, reading,
 * updating, and deleting tasks.
 */
class TaskController {
  /**
   * Get All Tasks Handler
   *
   * Handles GET /api/v1/tasks requests.
   * Retrieves tasks for the authenticated user with pagination, filtering, and sorting.
   *
   * @param {Express.Request} req - Express request object
   * @param {Object} req.query - Query parameters (page, limit, status, priority, search, sort, order)
   * @param {string} req.userId - User ID from authentication middleware
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void} - Sends JSON response with tasks and pagination info
   */
  async getAllTasks(req, res, next) {
    try {
      // Get tasks with filters, pagination, and sorting
      const { tasks, totalTasks, page, limit } = await taskService.getTasks(
        req.query,
        req.userId
      );

      // Send response with tasks and pagination metadata
      res.status(200).json({
        message: "Tasks fetched successfully",
        pagination: {
          page,
          limit,
          totalDocs: totalTasks,
          totalPages: Math.ceil(totalTasks / limit)
        },
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Task Handler
   *
   * Handles POST /api/v1/tasks requests.
   * Creates a new task for the authenticated user.
   *
   * @param {Express.Request} req - Express request object
   * @param {Object} req.body - Task data to create
   * @param {string} req.body.title - Task title
   * @param {string} req.body.description - Task description
   * @param {string} req.body.priority - Task priority (low, medium, high)
   * @param {Date} req.body.dueDate - Task due date
   * @param {string} req.userId - User ID from authentication middleware
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void} - Sends JSON response with created task
   */
  async createTask(req, res, next) {
    try {
      // Combine request body with authenticated user ID
      const taskData = { ...req.body, user: req.userId };

      // Create task through service
      const newTask = await taskService.createTask(taskData);

      // Send success response
      res.status(201).json({
        message: "Task created successfully",
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Task by ID Handler
   *
   * Handles GET /api/v1/tasks/:id requests.
   * Retrieves a specific task by ID, ensuring it belongs to the authenticated user.
   *
   * @param {Express.Request} req - Express request object
   * @param {string} req.params.id - Task ID
   * @param {string} req.userId - User ID from authentication middleware
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void} - Sends JSON response with task data
   */
  async getTask(req, res, next) {
    try {
      const taskId = req.params.id;

      // Get task and verify ownership
      const task = await taskService.getTaskById(taskId, req.userId);

      res.status(200).json({
        message: "Task retrieved successfully",
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Task Handler
   *
   * Handles PATCH /api/v1/tasks/:id requests.
   * Updates a specific task, ensuring it belongs to the authenticated user.
   *
   * @param {Express.Request} req - Express request object
   * @param {string} req.params.id - Task ID
   * @param {Object} req.body - Task data to update (partial update allowed)
   * @param {string} req.userId - User ID from authentication middleware
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void} - Sends JSON response with updated task
   */
  async updateTask(req, res, next) {
    try {
      const taskId = req.params.id;
      const updateData = req.body;

      // Update task and verify ownership
      const updatedTask = await taskService.updateTask(
        taskId,
        req.userId,
        updateData
      );

      res.status(200).json({
        message: "Task updated successfully",
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Task Handler
   *
   * Handles DELETE /api/v1/tasks/:id requests.
   * Deletes a specific task, ensuring it belongs to the authenticated user.
   *
   * @param {Express.Request} req - Express request object
   * @param {string} req.params.id - Task ID
   * @param {string} req.userId - User ID from authentication middleware
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   *
   * @returns {void} - Sends JSON response confirming deletion
   */
  async deleteTask(req, res, next) {
    try {
      const taskId = req.params.id;

      // Delete task and verify ownership
      await taskService.deleteTask(taskId, req.userId);

      res.status(200).json({
        message: "Task deleted successfully",
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
