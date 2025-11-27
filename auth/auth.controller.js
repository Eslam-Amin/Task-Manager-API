/**
 * Authentication Controller
 * 
 * This module handles HTTP requests related to user authentication.
 * It processes requests, calls the authentication service, and sends responses.
 * 
 * @module auth/auth.controller
 */

const authService = require("./auth.service");
const UserDto = require("../users/user.dto");

/**
 * Authentication Controller Class
 * 
 * Handles HTTP requests for authentication operations such as
 * user registration and login.
 */
class AuthController {
  constructor() {}

  /**
   * Register User Handler
   * 
   * Handles POST /api/v1/auth/register requests.
   * Creates a new user account and returns user data (without password).
   * 
   * @param {Express.Request} req - Express request object
   * @param {Object} req.body - Request body containing user registration data
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   * 
   * @returns {void} - Sends JSON response with user data
   * 
   * @example
   * // Request body:
   * {
   *   "firstName": "John",
   *   "lastName": "Doe",
   *   "email": "john@example.com",
   *   "password": "password123",
   *   "phone": "01012345678",
   *   "gender": "male",
   *   "dateOfBirth": "1990-01-01"
   * }
   */
  async registerOne(req, res, next) {
    try {
      // Create user through authentication service
      const user = await authService.registerOne(req.body);
      
      // Send success response with user data (using DTO to exclude sensitive fields)
      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: new UserDto(user)
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  }

  /**
   * Login Handler
   * 
   * Handles POST /api/v1/auth/login requests.
   * Authenticates user and returns user data with JWT token.
   * 
   * @param {Express.Request} req - Express request object
   * @param {Object} req.body - Request body containing login credentials
   * @param {string} req.body.email - User's email address
   * @param {string} req.body.password - User's password
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   * 
   * @returns {void} - Sends JSON response with user data and JWT token
   * 
   * @example
   * // Request body:
   * {
   *   "email": "john@example.com",
   *   "password": "password123"
   * }
   * 
   * // Response:
   * {
   *   "success": true,
   *   "message": "User logged in successfully",
   *   "data": {
   *     "_id": "...",
   *     "firstName": "John",
   *     "email": "john@example.com",
   *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *   }
   * }
   */
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
        data: { ...new UserDto(user), token }
      });
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  }
}

module.exports = new AuthController();
