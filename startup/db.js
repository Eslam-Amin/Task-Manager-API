/**
 * Database Connection Configuration
 * 
 * This module handles the MongoDB database connection using Mongoose.
 * It connects to the database specified in the configuration and logs
 * the connection status.
 * 
 * @module startup/db
 */

const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../config");

/**
 * Mongoose Configuration
 * 
 * strictQuery: false - Allows querying fields that are not in the schema
 * This provides more flexibility but should be used carefully
 */
mongoose.set("strictQuery", false);

/**
 * Establishes connection to MongoDB database
 * 
 * Connects to the MongoDB instance specified in config.database.URI.
 * On successful connection, logs the connection host to both console and logger.
 * 
 * @param {any} _ - Unused parameter (maintains consistency with other startup modules)
 * 
 * @example
 * // Connection string format: mongodb://host:port/database-name
 * // Example: mongodb://127.0.0.1:27017/task-manager-dev
 */
module.exports = (_) => {
  mongoose
    .connect(config.database.URI)
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`.green.bold);
      logger.info(`Database Connected: ${conn.connection.host}`);
    })
    .catch((error) => {
      console.error("Database connection error:".red.bold, error);
      logger.error(`Database connection failed: ${error.message}`);
      // Exit process if database connection fails
      process.exit(1);
    });
};
