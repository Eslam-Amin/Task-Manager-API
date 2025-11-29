const Joi = require("joi");
const joiErrorHandler = require("../utils/joiErrorHandler");
const { TASK_STATUS, TASK_PRIORITY } = require("./task.enum");

class TaskValidator {
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

  filterTasks(req, _, next) {
    const schema = Joi.object({
      page: Joi.number().optional().default(1),
      limit: Joi.number().optional().default(10),
      status: Joi.string()
        .lowercase()
        .optional()
        .valid(...TASK_STATUS),
      priority: Joi.string()
        .lowercase()
        .optional()
        .valid(...TASK_PRIORITY),
      search: Joi.string().optional(),
      sort: Joi.string().optional().valid("priority", "status"),
      order: Joi.string().optional().valid("asc", "desc")
    });
    joiErrorHandler.validate(schema, req.query);
    next();
  }
}

module.exports = new TaskValidator();
