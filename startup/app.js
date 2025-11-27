const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger");

const appRoutes = require("./routes.js");
const globalError = require("../middlewares/error.middleware");

module.exports = (app) => {
  // Middlewares
  app.use(cors());
  app.options("*", cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "25kb" }));

  // Swagger API Documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Task Manager API Documentation"
    })
  );

  app.use("/api/v1", appRoutes);

  // Global Error Handler
  app.use(globalError);
};
