const express = require("express");

const authController = require("./auth.controller");
const authValidator = require("./auth.validator");
const userValidator = require("../users/user.validator");

const router = express.Router();

// Registration uses user validator since it validates full user profile
router
  .route("/register")
  .post(userValidator.createOne, authController.registerOne);

router.route("/login").post(authValidator.login, authController.loginOne);

module.exports = router;
