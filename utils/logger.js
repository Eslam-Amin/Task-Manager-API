const winston = require("winston");
require("winston-mongodb");
const config = require("../config");

const logger = winston.createLogger({
  transports:
    config.NODE_ENV === "production"
      ? [
          new winston.transports.File({ filename: "logfile.log" }),
          new winston.transports.MongoDB({
            db: config.logger.DB_LOGGER,
            options: { useUnifiedTopology: true },
            level: "info"
          })
        ]
      : [new winston.transports.File({ filename: "logfile.log" })]
});

module.exports = logger;
