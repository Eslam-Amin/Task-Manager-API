/**
 * Route Aggregation Module
 * 
 * This module aggregates all application routes and provides a centralized
 * route configuration. It also handles 404 (Not Found) errors for undefined routes.
 * 
 * @module startup/routes
 */

const appRouter = require("express").Router();
const ApiError = require("../utils/ApiError");

// Import route modules
const userRoutes = require("../users/user.routes");
const taskRoutes = require("../tasks/task.routes");
const authRoutes = require("../auth/auth.routes");

/**
 * Route Registration
 * 
 * Registers all application routes with their respective prefixes:
 * - /users - User management routes
 * - /tasks - Task management routes
 * - /auth - Authentication routes
 * 
 * These routes will be accessible at /api/v1/{route-prefix}
 */
appRouter.use("/users", userRoutes);
appRouter.use("/tasks", taskRoutes);
appRouter.use("/auth", authRoutes);

/**
 * 404 Not Found Handler
 * 
 * This catch-all route handles any requests that don't match the defined routes.
 * It creates an ApiError with a 404 status code and passes it to the error handler.
 * 
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
appRouter.all("*", (req, res, next) => {
  next(ApiError.notFound(`This Route (${req.originalUrl}) is not found`));
});

module.exports = appRouter;
