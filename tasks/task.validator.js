const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const joiErrorHandler = require("../utils/joiErrorHandler");
const { TASK_STATUS, TASK_PRIORITY } = require("../utils/constants");

class TaskValidator {
  createTask(req, _, next) {
    const schema = Joi.object({
      title: Joi.string().required().min(3).max(100),
      description: Joi.string().optional().allow("").max(500),
      dueDate: Joi.date().min("now").required(),
      priority: Joi.string()
        .valid(...TASK_PRIORITY)
        .required(),
      status: Joi.string()
        .valid(...TASK_STATUS)
        .required()
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }

  updateTask(req, _, next) {
    const schema = Joi.object({
      title: Joi.string().optional().min(3).max(100),
      description: Joi.string().optional().allow("").max(500),
      dueDate: Joi.date().min("now").required(),
      priority: Joi.string()
        .valid(...TASK_PRIORITY)
        .required(),
      status: Joi.string()
        .valid(...TASK_STATUS)
        .required()
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }
}

module.exports = new TaskValidator();
