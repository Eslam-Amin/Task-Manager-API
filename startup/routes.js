// Aggregates all application routes and handles 404 for undefined routes.
// All routes are accessible under /api/v1 prefix.

const appRouter = require("express").Router();
const ApiError = require("../utils/ApiError");

const userRoutes = require("../users/user.routes");
const taskRoutes = require("../tasks/task.routes");
const authRoutes = require("../auth/auth.routes");

// Register route modules
appRouter.use("/users", userRoutes);
appRouter.use("/tasks", taskRoutes);
appRouter.use("/auth", authRoutes);
appRouter.get("/ping", (req, res) => res.json({ data: "pong" }));

// Catch-all 404 handler for undefined routes
appRouter.all("*", (req, res, next) => {
  next(ApiError.notFound(`This Route (${req.originalUrl}) is not found`));
});

module.exports = appRouter;
