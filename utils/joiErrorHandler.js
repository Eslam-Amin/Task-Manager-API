// joiErrorHandler.js
const ApiError = require("../utils/ApiError");

class JoiErrorHandler {
  static validate(schema, data) {
    const { error } = schema.validate(data, { abortEarly: false });

    if (!error) return;

    // Map all errors to readable messages
    const messages = error.details.map((detail) => {
      let msg = detail.message
        .replace(/"/g, "")
        .split(" ")
        .join(" ")
        .split("_")
        .join(" ");
      return `${msg.charAt(0).toUpperCase()}${msg.slice(1)}`;
    });

    // Throw a single ApiError with all messages joined
    throw ApiError.badRequest(messages.join(", "));
  }
}

module.exports = JoiErrorHandler;
