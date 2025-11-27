/**
 * Global Error Handler Middleware
 *
 * This module provides centralized error handling for the entire application.
 * It catches all errors, transforms them into appropriate API responses,
 * and handles different types of errors (database, validation, JWT, etc.).
 *
 * @module middlewares/error.middleware
 */

const config = require("../config");
const ApiError = require("../utils/ApiError");

/**
 * ErrorHandler Class
 *
 * Provides centralized error handling functionality for the application.
 * All methods are static as they don't require instance state.
 *
 * @class ErrorHandler
 */
class ErrorHandler {
  /**
   * Send Error Response for Development Environment
   *
   * In development, sends detailed error information including stack trace
   * to help with debugging.
   *
   * @static
   * @param {Error} err - Error object
   * @param {Express.Response} res - Express response object
   */
  static sendErrorForDev(err, res) {
    console.log("🚀 ~ sendErrorForDev ~ err:", err);
    res.status(err.statusCode).json({
      success: err.success || false,
      message: err.message || "Something went wrong",
      stack: err.stack // Include stack trace in development
    });
  }

  /**
   * Send Error Response for Production Environment
   *
   * In production, sends minimal error information to prevent exposing
   * sensitive details. Only operational errors show their messages.
   *
   * @static
   * @param {Error} err - Error object
   * @param {Express.Response} res - Express response object
   */
  static sendErrorForProd(err, res) {
    // For non-operational errors (programming errors), send generic message
    if (!err.isOperational) {
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

  /**
   * Handle MongoDB Cast Errors
   *
   * Converts MongoDB cast errors (invalid ObjectId, invalid date, etc.)
   * into user-friendly error messages.
   *
   * @static
   * @param {Error} err - MongoDB cast error
   * @returns {ApiError} - Formatted API error
   */
  static handleCastErrorDB(err) {
    const message = `Invalid ${err.path}: ${err.value}`;
    return ApiError.badRequest(message);
  }

  /**
   * Handle MongoDB Duplicate Field Errors
   *
   * Converts MongoDB duplicate key errors (unique constraint violations)
   * into user-friendly error messages.
   *
   * @static
   * @param {Error} error - MongoDB duplicate key error
   * @returns {ApiError} - Formatted API error
   */
  static handleDuplicatedFieldsDB(error) {
    // Extract the field name that caused the duplicate error
    const duplicateKey = Object.keys(error.keyPattern)[0];
    let message = `${duplicateKey} is already used`;

    return ApiError.badRequest(message);
  }

  /**
   * Handle Mongoose Validation Errors
   *
   * Converts Mongoose validation errors into a single formatted message
   * containing all validation errors.
   *
   * @static
   * @param {Error} err - Mongoose validation error
   * @returns {ApiError} - Formatted API error
   */
  static handleValidationError(err) {
    // Extract all validation error messages
    const errors = Object.values(err.errors).map((el) => {
      return el.message;
    });
    const message = `Invalid Input Data ${errors.join(". ")}`;
    return ApiError.badRequest(message);
  }

  /**
   * Handle Invalid JWT Signature Errors
   *
   * @static
   * @returns {ApiError} - Unauthorized error for invalid token
   */
  static handleInvalidJwtSignature() {
    return ApiError.unauthorized("Invalid token, Please login again ...");
  }

  /**
   * Handle Expired JWT Token Errors
   *
   * @static
   * @returns {ApiError} - Unauthorized error for expired token
   */
  static handleJwtExpired() {
    return ApiError.unauthorized("Expired token, Please login again ...");
  }

  /**
   * Global Error Handler Middleware
   *
   * This is the main error handling middleware that must be placed
   * after all routes. It catches all errors and processes them.
   *
   * Error Processing Flow:
   * 1. Set default error properties
   * 2. Transform specific error types (JWT, MongoDB, Validation)
   * 3. Send appropriate response based on environment
   *
   * @static
   * @param {Error} err - Error object
   * @param {Express.Request} req - Express request object
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static handle(err, req, res, next) {
    // Set default error properties
    err.success = err.success || false;
    err.statusCode = err.statusCode || 500;

    // Create a copy of the error for processing
    let error = { ...err };
    error.message = err.message;

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
