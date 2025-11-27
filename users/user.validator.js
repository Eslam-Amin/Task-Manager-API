const Joi = require("joi");
const joiErrorHandler = require("../utils/joiErrorHandler");
const { GENDER_LIST } = require("../utils/constants");

class UserValidator {
  createOne(req, _, next) {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required().min(3).max(32),
      password: Joi.string().required().min(3).max(255),
      phone: Joi.string()
        .required()
        .pattern(/^(?:\+?20)?(?:0)?1[0-2]\d{8}$/),
      gender: Joi.string()
        .valid(...GENDER_LIST)
        .required(),
      dateOfBirth: Joi.string().required().isoDate().max("now")
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }

  updateOne(req, _, next) {
    const schema = Joi.object({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional().min(3).max(32),
      password: Joi.string().optional().min(3).max(255),
      phone: Joi.string()
        .optional()
        .pattern(/^(?:\+?20)?(?:0)?1[0-2]\d{8}$/),
      gender: Joi.string()
        .valid(...GENDER_LIST)
        .optional(),
      dateOfBirth: Joi.string().optional().isoDate().max("now")
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }
}

module.exports = new UserValidator();
