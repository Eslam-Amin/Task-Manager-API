const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");

// User Routes
const ApiError = require("../utils/ApiError");
const globalError = require("../middlewares/error.middleware");

module.exports = (app) => {
  // Middlewares
  app.use(cors());
  app.options("*", cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "25kb" }));

  // Not Found Route
  app.all("*", (req, res, next) => {
    next(new ApiError(`This Route (${req.originalUrl}) is not found`, 400));
  });

  // Global Error Handler
  app.use(globalError);
};
