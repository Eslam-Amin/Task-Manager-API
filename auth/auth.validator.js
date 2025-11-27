const Joi = require("joi");
const joiErrorHandler = require("../utils/joiErrorHandler");
const { GENDER_LIST } = require("../utils/constants");

class AuthValidator {
  login(req, _, next) {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    });
    joiErrorHandler.validate(schema, req.body);
    next();
  }
}

module.exports = new AuthValidator();
