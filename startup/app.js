const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");

const globalError = require("../middlewares/error.middleware");

module.exports = (app) => {
  // Middlewares
  app.use(cors());
  app.options("*", cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "25kb" }));

  // Global Error Handler
  app.use(globalError);
};
