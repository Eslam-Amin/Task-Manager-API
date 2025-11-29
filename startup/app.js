// Configures Express application with middleware, routes, and error handling.
// Middleware order is critical: CORS → compression → body parsing → Swagger → routes → error handler.

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger");

const appRoutes = require("./routes.js");
const globalError = require("../middlewares/error.middleware");

module.exports = (app) => {
  // Enable CORS for all origins and handle preflight requests
  app.use(cors());
  app.options("*", cors());

  // Compress response bodies to reduce bandwidth
  app.use(compression());

  // Parse request bodies: JSON, URL-encoded, and additional JSON with 25kb limit
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "25kb" }));

  /**
   * Swagger API Documentation
   *
   * Serves interactive API documentation at /api-docs
   * - swaggerUi.serve: Serves Swagger UI static files
   * - swaggerUi.setup: Configures Swagger UI with custom options
   *
   * Access the documentation at: http://localhost:5050/api-docs
   */
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Task Manager API Documentation"
    })
  );

  // Mount all API routes under /api/v1 prefix
  app.use("/api/v1", appRoutes);

  /**
   * Global Error Handler
   *
   * This middleware must be placed after all routes.
   * It catches all errors thrown in the application and sends
   * appropriate error responses based on the environment.
   */
  app.use(globalError);
};
