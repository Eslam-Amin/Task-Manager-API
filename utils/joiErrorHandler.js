// Joi validation error handler formats validation errors into user-friendly messages.
// Collects all errors (doesn't stop at first) and throws a single ApiError.

const ApiError = require("../utils/ApiError");

/**
 * Joi Error Handler Class
 *
 * Provides methods for validating data against Joi schemas and
 * formatting validation errors into user-friendly messages.
 */
class JoiErrorHandler {
  // Validates data against Joi schema and throws formatted error if validation fails.
  // Collects all errors, removes quotes/underscores, capitalizes, and joins into single message.
  static validate(schema, data) {
    // Validate data against schema
    // abortEarly: false - Collect all errors, don't stop at first error
    const { error } = schema.validate(data, { abortEarly: false });

    // If no errors, return early
    if (!error) return;

    // Map all validation errors to readable messages
    const messages = error.details.map((detail) => {
      let msg = detail.message
        .replace(/"/g, "") // Remove quotes
        .split(" ")
        .join(" ") // Normalize whitespace
        .split("_") // Replace underscores with spaces
        .join(" ");

      // Capitalize first letter
      return `${msg.charAt(0).toUpperCase()}${msg.slice(1)}`;
    });

    // Throw a single ApiError with all validation messages joined
    throw ApiError.badRequest(messages.join(", "));
  }
}

module.exports = JoiErrorHandler;
