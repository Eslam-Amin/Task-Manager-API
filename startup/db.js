const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../config");

mongoose.set("strictQuery", false);

module.exports = (_) => {
  mongoose.connect(config.database.URI).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`.green.bold);
    logger.info(`Database Connected: ${conn.connection.host}`);
  });
};
