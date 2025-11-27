/**
 * Joi Validation Error Handler
 * 
 * This module provides utilities for handling Joi validation errors.
 * It formats Joi error messages into user-friendly strings and throws
 * appropriate API errors.
 * 
 * @module utils/joiErrorHandler
 */

const ApiError = require("../utils/ApiError");

/**
 * Joi Error Handler Class
 * 
 * Provides methods for validating data against Joi schemas and
 * formatting validation errors into user-friendly messages.
 */
class JoiErrorHandler {
  /**
   * Validate Data Against Joi Schema
   * 
   * Validates data against a Joi schema and throws a formatted error
   * if validation fails. Collects all validation errors and formats them
   * into a single, readable error message.
   * 
   * @param {Object} schema - Joi validation schema
   * @param {any} data - Data to validate
   * @returns {void} - Returns nothing if validation passes
   * @throws {ApiError} - Throws 400 Bad Request error if validation fails
   * 
   * @example
   * const schema = Joi.object({
   *   email: Joi.string().email().required(),
   *   password: Joi.string().min(6).required()
   * });
   * 
   * JoiErrorHandler.validate(schema, { email: 'invalid', password: '123' });
   * // Throws: ApiError with message "Email must be a valid email, Password length must be at least 6 characters long"
   */
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
