const userRoutes = require("../users/user.routes");
const taskRoutes = require("../tasks/task.routes");
const authRoutes = require("../auth/auth.routes");

module.exports = (app) => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/tasks", taskRoutes);
  app.use("/api/v1/auth", authRoutes);

  // Not Found Route
  app.all("*", (req, res, next) => {
    next(ApiError.notFound(`This Route (${req.originalUrl}) is not found`));
  });
};
