// Winston logger configuration with environment-specific transports.
// Development: file logging only. Production: file + MongoDB logging.

const winston = require("winston");
require("winston-mongodb");
const config = require("../config");

const logger = winston.createLogger({
  transports:
    config.NODE_ENV === "production"
      ? [
          // File transport for all logs
          new winston.transports.File({ filename: "logfile.log" }),
          
          // MongoDB transport for info level and above
          new winston.transports.MongoDB({
            db: config.logger.DB_LOGGER,
            options: { useUnifiedTopology: true },
            level: "info"
          })
        ]
      : [
          // Development: file logging only
          new winston.transports.File({ filename: "logfile.log" })
        ]
});

module.exports = logger;
