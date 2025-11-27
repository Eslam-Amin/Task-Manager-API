/**
 * Server Entry Point
 * 
 * This is the main entry point of the application. It initializes the Express app,
 * sets up all middleware, connects to the database, and starts the HTTP server.
 * 
 * @module server
 */

const express = require("express");
const logger = require("./utils/logger");
const config = require("./config");
require("dotenv").config();
require("colors");

/**
 * Express Application Instance
 * Creates a new Express application that will handle HTTP requests
 */
const app = express();

/**
 * Server Configuration
 * Retrieves port and environment from configuration, with fallback values
 */
const PORT = config.PORT || 5050;
const NODE_ENV = config.NODE_ENV || "development";

/**
 * Application Startup Sequence
 * 
 * The startup process follows this order:
 * 1. Logging setup - Configures Winston logger and Morgan HTTP logger
 * 2. App configuration - Sets up middleware, routes, and Swagger documentation
 * 3. Database connection - Connects to MongoDB
 * 
 * This order ensures proper initialization of dependencies
 */
require("./startup/logging")(app);
require("./startup/app")(app);
require("./startup/db")();

/**
 * HTTP Server
 * 
 * Starts the HTTP server and listens on the configured port.
 * Logs server startup information to both console and logger.
 * 
 * @param {number} PORT - Port number to listen on
 * @param {Function} callback - Callback executed when server starts listening
 */
const server = app.listen(PORT, (_) => {
  console.log(`Running on port ${PORT}`.blue.bold);
  logger.info(`Server (${NODE_ENV}) started on Port ${PORT} at ${new Date()}`);
});

/**
 * Export server instance
 * Allows the server to be used in tests or other modules
 */
module.exports = server;
