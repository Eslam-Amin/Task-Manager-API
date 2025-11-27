/**
 * Logging Configuration
 * 
 * This module configures logging for the application using Winston and Morgan.
 * It sets up different logging behaviors for development and production environments,
 * including handling uncaught exceptions and unhandled promise rejections.
 * 
 * @module startup/logging
 */

const morgan = require("morgan");
const winston = require("winston");
const config = require("../config");

/**
 * Configures logging middleware and exception handling
 * 
 * Sets up:
 * 1. Environment mode logging
 * 2. Production exception handling (uncaught exceptions and unhandled rejections)
 * 3. HTTP request logging with Morgan
 * 
 * @param {Express} app - Express application instance
 */
module.exports = (app) => {
  // Log current environment mode
  console.log(`Mode: ${config.NODE_ENV}`.blue.bold);

  /**
   * Production Environment Exception Handling
   * 
   * In production, we want to catch and log all uncaught exceptions
   * and unhandled promise rejections to prevent the application from crashing.
   */
  if (config.NODE_ENV === "production") {
    /**
     * Handle Uncaught Exceptions
     * Catches synchronous errors that weren't caught by try-catch blocks
     */
    winston.exceptions.handle(
      new winston.transports.File({ filename: "uncaughtExceptions.log" })
    );

    /**
     * Handle Unhandled Promise Rejections
     * Catches asynchronous errors from promises that weren't handled
     */
    process.on("unhandledRejection", (ex) => {
      throw ex; // Re-throw to be caught by winston.exceptions.handle
    });
  }

  /**
   * HTTP Request Logging Middleware
   * 
   * Morgan middleware logs all HTTP requests in development mode.
   * Format: "dev" provides colored output with method, URL, status, and response time
   * 
   * Example output: GET /api/v1/tasks 200 15.234 ms
   */
  app.use(morgan("dev"));
};
