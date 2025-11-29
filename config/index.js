// Centralized application configuration loaded from environment variables.
// Provides sensible defaults for development while requiring explicit values in production.

require("dotenv").config();

module.exports = {
  database: {
    URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager-dev",
    PASSWORD: process.env.DB_PASSWORD,
    USERNAME: process.env.DB_USERNAME
  },

  logger: {
    // Separate database for application logs in production
    DB_LOGGER:
      process.env.LOG_URI || "mongodb://127.0.0.1:27017/task-manager-logs-dev"
  },

  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5050,
  APP_NAME: process.env.APP_NAME || "Task Manager",

  // JWT token expiration format: "30d", "24h", "3600s"
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,

  // Must be set in production for security
  JWT_SECRET: process.env.JWT_SECRET,

  // Bcrypt salt rounds (default: 10, higher = more secure but slower)
  SALT_ROUNDS: process.env.SALT_ROUNDS
};
