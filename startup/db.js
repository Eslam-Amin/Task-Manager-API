// Establishes MongoDB connection using Mongoose.
// Exits process on connection failure since database is critical for application operation.

const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../config");

// Allow querying fields not in schema (use with caution)
mongoose.set("strictQuery", false);

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
      process.exit(1);
    });
};
