const morgan = require("morgan");
const winston = require("winston");
const config = require("../config");

module.exports = (app) => {
  console.log(`Mode: ${config.NODE_ENV}`.blue.bold);
  if (config.NODE_ENV === "production") {
    winston.exceptions.handle(
      new winston.transports.File({ filename: "uncaughtExceptions.log" })
    );
    process.on("unhandledRejection", (ex) => {
      throw ex;
    });
  }
  app.use(morgan("dev"));
};
