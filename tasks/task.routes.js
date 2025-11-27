const express = require("express");

// User Validators
const taskValidator = require("./task.validator");

const taskController = require("./task.controller");

// Auth Middleware
const { protect } = require("../middlewares/auth.middleware");

// Router
const router = express.Router();

// Protect
router.use(protect);

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskValidator.createTask, taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskValidator.updateTask, taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
