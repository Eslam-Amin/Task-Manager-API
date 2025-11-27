/**
 * User Controller
 * 
 * This module handles HTTP requests related to user management.
 * It processes requests, calls the user service, and sends responses.
 * 
 * @module users/user.controller
 */

/**
 * User Controller Class
 * 
 * Handles HTTP requests for user operations such as retrieving,
 * updating, and deleting users.
 */
class UserController {
  constructor() {
    this.userService = require("./user.service");
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAll();
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
      const user = await this.userService.getOneById(req.params.id);
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
      const updatedUser = await this.userService.updateOne(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await this.userService.deleteOne(req.params.id);
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
