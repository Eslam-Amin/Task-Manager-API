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
        .pattern(/^01[0-2]\d{8}$/)
        .messages({
          "string.pattern.base":
            "Phone number must start with 01 and contain 11 digits"
        }),
      gender: Joi.string()
        .lowercase()
        .valid(...GENDER_LIST)
        .required(),
      dateOfBirth: Joi.date().iso().required().max("now").messages({
        "date.max": "Date of birth cannot be in the future"
      })
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
        .pattern(/^01[0-2]\d{8}$/)
        .messages({
          "string.pattern.base":
            "Phone number must start with 01 and contain 11 digits"
        }),
      gender: Joi.string()
        .lowercase()
        .valid(...GENDER_LIST)
        .optional(),
      dateOfBirth: Joi.date().iso().optional().max("now").messages({
        "date.max": "Date of birth cannot be in the future"
      })
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }
}

module.exports = new UserValidator();
