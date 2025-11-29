// Task controller handles HTTP requests for task CRUD operations.
// All routes require authentication and enforce user ownership of tasks.

const taskService = require("./task.service");

/**
 * Task Controller Class
 *
 * Handles HTTP requests for task operations such as creating, reading,
 * updating, and deleting tasks.
 */
class TaskController {
  // Handles GET /api/v1/tasks
  // Returns paginated, filtered, and sorted tasks for authenticated user
  async getAllTasks(req, res, next) {
    try {
      // Get tasks with filters, pagination, and sorting
      const { tasks, totalTasks, page, limit } = await taskService.getTasks(
        req.userId,
        req.query
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

  // Handles POST /api/v1/tasks
  // Creates new task for authenticated user
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

  // Handles GET /api/v1/tasks/:id
  // Returns task if it belongs to authenticated user
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

  // Handles PATCH /api/v1/tasks/:id
  // Updates task if it belongs to authenticated user (partial updates allowed)
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

  // Handles DELETE /api/v1/tasks/:id
  // Deletes task if it belongs to authenticated user
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
