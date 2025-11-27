/**
 * Logger Configuration
 * 
 * This module configures Winston logger for the application.
 * It sets up different logging transports based on the environment.
 * 
 * @module utils/logger
 */

const winston = require("winston");
require("winston-mongodb");
const config = require("../config");

/**
 * Winston Logger Instance
 * 
 * Configured logger with different transports based on environment:
 * - Development: File logging only
 * - Production: File logging + MongoDB logging
 * 
 * Log Levels:
 * - error: Error level logs
 * - warn: Warning level logs
 * - info: Informational logs
 * - verbose: Verbose logs
 * - debug: Debug logs
 * - silly: Silly logs
 */
const logger = winston.createLogger({
  transports:
    config.NODE_ENV === "production"
      ? [
          // File transport - logs to logfile.log
          new winston.transports.File({ filename: "logfile.log" }),
          
          // MongoDB transport - logs to MongoDB database
          new winston.transports.MongoDB({
            db: config.logger.DB_LOGGER,
            options: { useUnifiedTopology: true },
            level: "info" // Only log info level and above to MongoDB
          })
        ]
      : [
          // Development: Only file logging
          new winston.transports.File({ filename: "logfile.log" })
        ]
});

module.exports = logger;
