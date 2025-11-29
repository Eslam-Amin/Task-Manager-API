const express = require("express");

const taskValidator = require("./task.validator");
const taskController = require("./task.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// All task routes require authentication
router.use(protect);

router
  .route("/")
  .get(taskValidator.filterTasks, taskController.getAllTasks)
  .post(taskValidator.createTask, taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskValidator.updateTask, taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
