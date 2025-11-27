const express = require("express");

const userController = require("./user.controller");
const userValidator = require("./user.validator");

// Auth Middleware
const { protect } = require("../middlewares/auth.middleware");

// Router
const router = express.Router();

router.route("/").get(userController.getAllUsers);

// Protect
router.use(protect);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userValidator.updateOne, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
