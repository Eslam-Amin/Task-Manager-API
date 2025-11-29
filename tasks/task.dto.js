// Task DTO defines the shape of task data returned to clients.
// Excludes internal fields like priorityValue, statusValue, and user reference.

class TaskDTO {
  static toTaskDTO(task) {
    return {
      _id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt
    };
  }
}

module.exports = TaskDTO;
