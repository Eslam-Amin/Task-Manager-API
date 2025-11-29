// Configures application logging with Winston and Morgan.
// In production, catches uncaught exceptions and unhandled rejections to prevent crashes.

const morgan = require("morgan");
const winston = require("winston");
const config = require("../config");

module.exports = (app) => {
  console.log(`Mode: ${config.NODE_ENV}`.blue.bold);

  // Production: log uncaught exceptions and unhandled rejections to prevent crashes
  if (config.NODE_ENV === "production") {
    // Catch synchronous errors not handled by try-catch
    winston.exceptions.handle(
      new winston.transports.File({ filename: "uncaughtExceptions.log" })
    );

    // Catch async promise rejections and re-throw to be handled by winston
    process.on("unhandledRejection", (ex) => {
      throw ex;
    });
  }

  // HTTP request logging: colored output with method, URL, status, response time
  app.use(morgan("dev"));
};
