const express = require("express");

const userController = require("./user.controller");
const userValidator = require("./user.validator");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public route: get all users
router.route("/").get(userController.getAllUsers);

// Protected routes: require authentication
router.use(protect);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userValidator.updateOne, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
