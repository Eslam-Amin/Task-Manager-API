// Authentication controller handles HTTP requests for user registration and login.
// Validates requests, delegates to auth service, and formats responses.

const authService = require("./auth.service");

/**
 * Authentication Controller Class
 *
 * Handles HTTP requests for authentication operations such as
 * user registration and login.
 */
class AuthController {
  // Handles POST /api/v1/auth/register
  // Creates new user account and returns user data (password excluded via DTO).
  async registerOne(req, res, next) {
    try {
      // Create user through authentication service
      const user = await authService.registerOne(req.body);

      // Send success response with user data (using DTO to exclude sensitive fields)
      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  }

  // Handles POST /api/v1/auth/login
  // Authenticates credentials and returns user data with JWT token.
  async loginOne(req, res, next) {
    try {
      // Authenticate user and get token
      const { user, token } = await authService.login(
        req.body.email,
        req.body.password
      );

      // Send success response with user data and token
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
        token
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  }
}

module.exports = new AuthController();
