class TaskController {
  constructor() {
    this.taskService = require("./task.service");
  }

  async createTask(req, res) {
    try {
      const taskData = req.body;
      const newTask = await this.taskService.createTask(taskData);
      res.status(201).json({
        data: newTask
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getTask(req, res) {
    try {
      const taskId = req.params.id;
      const task = await this.taskService.getTaskById(taskId, req.user._id);
      res.status(200).json({ data: task });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

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
