const appRouter = require("express").Router();

const userRoutes = require("../users/user.routes");
const taskRoutes = require("../tasks/task.routes");
const authRoutes = require("../auth/auth.routes");

appRouter.use("/users", userRoutes);
appRouter.use("/tasks", taskRoutes);
appRouter.use("/auth", authRoutes);

// Not Found Route
appRouter.all("*", (req, res, next) => {
  next(ApiError.notFound(`This Route (${req.originalUrl}) is not found`));
});

module.exports = appRouter;
