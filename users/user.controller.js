/**
 * User Controller
 *
 * This module handles HTTP requests related to user management.
 * It processes requests, calls the user service, and sends responses.
 *
 * @module users/user.controller
 */

const userService = require("./user.service");

/**
 * User Controller Class
 *
 * Handles HTTP requests for user operations such as retrieving,
 * updating, and deleting users.
 */
class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAll();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get specific user
  // @route   GET /api/v1/user/:id
  // @access  Public
  async getUserById(req, res, next) {
    try {
      const userId = req.params.id === "me" ? req.userId : req.params.id;
      const user = await userService.getOneById(userId);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id === "me" ? req.userId : req.params.id;
      const updatedUser = await userService.updateOne(
        userId,
        req.body,
        req.userId
      );
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    const userId = req.params.id === "me" ? req.userId : req.params.id;
    try {
      await userService.deleteOne(userId, req.userId);
      res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
