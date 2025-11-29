/**
 * Application Configuration
 * 
 * This module centralizes all application configuration by loading
 * environment variables from .env file and providing default values.
 * 
 * @module config
 */

require("dotenv").config();

/**
 * Application Configuration Object
 * 
 * Contains all configuration values for the application.
 * Values are loaded from environment variables with fallback defaults.
 */
module.exports = {
  /**
   * Database Configuration
   */
  database: {
    // MongoDB connection URI
    URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager-dev",
    // Database password (if required)
    PASSWORD: process.env.DB_PASSWORD,
    // Database username (if required)
    USERNAME: process.env.DB_USERNAME
  },

  /**
   * Logger Configuration
   */
  logger: {
    // MongoDB URI for logging (separate database for logs)
    DB_LOGGER:
      process.env.LOG_URI || "mongodb://127.0.0.1:27017/task-manager-logs-dev"
  },

  /**
   * Application Settings
   */
  // Node environment (development, production, test)
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Server port number
  PORT: process.env.PORT || 5050,
  
  // Application name
  APP_NAME: process.env.APP_NAME || "Task Manager",

  /**
   * JWT Configuration
   */
  // JWT token expiration time (e.g., "30d", "24h", "3600s")
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  
  // Secret key for signing JWT tokens (MUST be set in production)
  JWT_SECRET: process.env.JWT_SECRET,

  /**
   * Security Configuration
   */
  // Number of salt rounds for bcrypt password hashing (default: 10)
  SALT_ROUNDS: process.env.SALT_ROUNDS
};
