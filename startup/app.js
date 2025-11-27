/**
 * Express Application Configuration
 * 
 * This module configures the Express application with all necessary middleware,
 * routes, and error handling. It sets up CORS, body parsing, compression,
 * Swagger documentation, and the global error handler.
 * 
 * @module startup/app
 */

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../config/swagger");

const appRoutes = require("./routes.js");
const globalError = require("../middlewares/error.middleware");

/**
 * Configures the Express application with middleware and routes
 * 
 * Middleware Order:
 * 1. CORS - Enables Cross-Origin Resource Sharing
 * 2. Compression - Compresses response bodies
 * 3. Body Parsers - Parses JSON and URL-encoded request bodies
 * 4. Swagger UI - Serves API documentation
 * 5. Routes - Application routes
 * 6. Error Handler - Global error handling (must be last)
 * 
 * @param {Express} app - Express application instance
 */
module.exports = (app) => {
  /**
   * CORS (Cross-Origin Resource Sharing) Configuration
   * Allows the API to be accessed from different origins (domains)
   * app.options("*", cors()) handles preflight requests
   */
  app.use(cors());
  app.options("*", cors());

  /**
   * Compression Middleware
   * Compresses response bodies to reduce bandwidth usage
   * Automatically compresses responses for clients that support it
   */
  app.use(compression());

  /**
   * Body Parser Middleware
   * Parses incoming request bodies in different formats
   * - bodyParser.json(): Parses JSON request bodies
   * - bodyParser.urlencoded(): Parses URL-encoded request bodies
   * - express.json(): Additional JSON parser with size limit (25kb)
   */
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

  /**
   * Application Routes
   * All API routes are prefixed with /api/v1
   * Routes are defined in ./routes.js
   */
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
