// User controller handles HTTP requests for user management operations.
// Some routes are public, others require authentication.

const userService = require("./user.service");

/**
 * User Controller Class
 *
 * Handles HTTP requests for user operations such as retrieving,
 * updating, and deleting users.
 */
class UserController {
  // Handles GET /api/v1/users
  // Returns all users (public route)
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

  // Handles GET /api/v1/users/:id
  // Returns specific user by ID (requires authentication)
  async getUserById(req, res, next) {
    try {
      const user = await userService.getOneById(req.params.id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Handles PATCH /api/v1/users/:id
  // Updates user information (requires authentication)
  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateOne(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  // Handles DELETE /api/v1/users/:id
  // Deletes user (requires authentication)
  async deleteUser(req, res, next) {
    try {
      await userService.deleteOne(req.params.id);
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
