const express = require("express");

// User Validators
const {} = require("./task.validator");

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
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.createTask)
  .delete(taskController.createTask);

module.exports = router;
