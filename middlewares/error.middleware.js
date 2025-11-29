// Global error handler middleware. Must be placed after all routes.
// Transforms various error types (MongoDB, JWT, validation) into consistent API responses.
// Development mode includes stack traces; production hides sensitive details.

const config = require("../config");
const ApiError = require("../utils/ApiError");

class ErrorHandler {
  // Development mode: include stack trace for debugging
  static sendErrorForDev(err, res) {
    console.log("🚀 ~ sendErrorForDev ~ err:", err);
    res.status(err.statusCode).json({
      success: err.success || false,
      message: err.message || "Something went wrong",
      stack: err.stack
    });
  }

  // Production mode: hide stack traces, only show operational error messages
  static sendErrorForProd(err, res) {
    // For non-operational errors (programming errors), send generic message
    if (!err.isOperational) {
      // Programming errors: generic message to avoid exposing internals
      res.status(err.statusCode).json({
        success: false,
        message: "Something went wrong"
      });
    } else {
      // For operational errors (expected errors), send the error message
      res.status(err.statusCode).json({
        success: err.success || false,
        message: err.message
      });
    }
  }

  // Converts MongoDB cast errors (invalid ObjectId, date format) to user-friendly messages
  static handleCastErrorDB(err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return ApiError.badRequest(message);
  }

  // Converts MongoDB duplicate key errors to user-friendly messages
  static handleDuplicatedFieldsDB(error) {
    // Extract the field name that caused the duplicate error
    const duplicateKey = Object.keys(error.keyPattern)[0];
    let message = `${duplicateKey} is already used`;

    return ApiError.badRequest(message);
  }

  // Aggregates all Mongoose validation errors into a single message
  static handleValidationError(err) {
    // Extract all validation error messages
    const errors = Object.values(err.errors).map((el) => {
      return el.message;
    });
    const message = `Invalid Input Data ${errors.join(". ")}`;
    return ApiError.badRequest(message);
  }

  static handleInvalidJwtSignature() {
    return ApiError.unauthorized("Invalid token, Please login again ...");
  }

  static handleJwtExpired() {
    return ApiError.unauthorized("Expired token, Please login again ...");
  }

  // Main error handler: normalizes errors and sends appropriate response
  static handle(err, req, res, next) {
    // Set default error properties
    err.success = err.success || false;
    err.statusCode = err.statusCode || 500;

    // Create a copy of the error for processing
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Transform specific error types
    switch (err.name) {
      case "JsonWebTokenError":
        // Invalid JWT signature
        error = ErrorHandler.handleInvalidJwtSignature();
        break;
      case "TokenExpiredError":
        // Expired JWT token
        error = ErrorHandler.handleJwtExpired();
        break;
      case 11000:
        // MongoDB duplicate key error (error code 11000)
        error = ErrorHandler.handleDuplicatedFieldsDB(err);
        break;
      case "CastError":
        // MongoDB cast error (invalid ObjectId, date, etc.)
        error = ErrorHandler.handleCastErrorDB(err);
        break;
      case "ValidationError":
        // Mongoose validation error
        error = ErrorHandler.handleValidationError(err);
        break;
    }

    // Send error response based on environment
    if (config.NODE_ENV === "development") {
      ErrorHandler.sendErrorForDev(error, res);
    } else {
      ErrorHandler.sendErrorForProd(error, res);
    }
  }
}

module.exports = ErrorHandler.handle;
