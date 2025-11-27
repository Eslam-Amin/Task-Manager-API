const express = require("express");

// Controller
const authController = require("./auth.controller");

// Validator
const authValidator = require("./auth.validator");
const userValidator = require("../users/user.validator");
// Router
const router = express.Router();

// Auth Routes
router
  .route("/register")
  .post(userValidator.createOne, authController.registerOne);

router.route("/login").post(authValidator.login, authController.loginOne);

module.exports = router;
