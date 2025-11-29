// Task validator validates task creation and update requests using Joi schemas.

const Joi = require("joi");
const joiErrorHandler = require("../utils/joiErrorHandler");
const { TASK_STATUS, TASK_PRIORITY } = require("./task.enum");

class TaskValidator {
  // Validates task creation: title (3-100 chars), description (optional, max 500),
  // dueDate (ISO format, must be future), priority (from enum)
  createTask(req, _, next) {
    const schema = Joi.object({
      title: Joi.string().required().min(3).max(100),
      description: Joi.string().optional().allow("").max(500),
      dueDate: Joi.date().iso().min("now").required(),
      priority: Joi.string()
        .lowercase()
        .valid(...TASK_PRIORITY)
        .required()
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }

  // Validates task update: all fields optional, same constraints as create
  updateTask(req, _, next) {
    const schema = Joi.object({
      title: Joi.string().optional().min(3).max(100),
      description: Joi.string().optional().allow("").max(500),
      dueDate: Joi.date().iso().min("now").optional(),
      priority: Joi.string()
        .lowercase()
        .valid(...TASK_PRIORITY)
        .optional(),
      status: Joi.string()
        .lowercase()
        .valid(...TASK_STATUS)
        .optional()
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }
}

module.exports = new TaskValidator();
