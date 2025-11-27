const express = require("express");
const logger = require("./utils/logger");
const config = require("./config");
require("dotenv").config();
require("colors");

// Express app
const app = express();

// Port Number
const PORT = config.PORT || 5050;
const NODE_ENV = config.NODE_ENV || 5050;

// Startup
require("./startup/logging")(app);
require("./startup/app")(app);
require("./startup/db")();
require("./startup/routes")(app);

// Server
const server = app.listen(PORT, (_) => {
  console.log(`Running on port ${PORT}`.blue.bold);
  logger.info(`Server (${NODE_ENV}) started on Port ${PORT} at ${new Date()}`);
});

module.exports = server;
