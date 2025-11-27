require("dotenv").config();

module.exports = {
  database: {
    URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager-dev",
    PASWORD: process.env.DB_PASSWORD,
    USERNAME: process.env.DB_USERNAME
  },
  logger: {
    DB_LOGGER:
      process.env.LOG_URI || "mongodb://127.0.0.1:27017/task-manager-logs-dev"
  },

  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5050,
  APP_NAME: process.env.APP_NAME || "Task Manager",

  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_SECRET: process.env.JWT_SECRET
};
