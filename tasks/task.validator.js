const Joi = require("joi");
const joiErrorHandler = require("../utils/joiErrorHandler");
const { TASK_STATUS, TASK_PRIORITY } = require("../utils/constants");

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
}

module.exports = new TaskValidator();
