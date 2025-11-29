// Authentication validator validates login request data using Joi schemas.

const Joi = require("joi");
const joiErrorHandler = require("../utils/joiErrorHandler");

class AuthValidator {
  // Validates login request: email (3-32 chars) and password (3-255 chars)
  login(req, _, next) {
    const schema = Joi.object({
      email: Joi.string().email().required().min(3).max(32),
      password: Joi.string().required().min(3).max(255)
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }
}

module.exports = new AuthValidator();
