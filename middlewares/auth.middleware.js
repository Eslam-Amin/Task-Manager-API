/**
 * Authentication Middleware
 * 
 * This module provides authentication and authorization middleware for protecting routes.
 * It handles JWT token verification, session validation, and role-based access control.
 * 
 * @module middlewares/auth.middleware
 */

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const Hash = require("../utils/hash.js");
const config = require("../config");

/**
 * Authentication Middleware Class
 * 
 * Provides methods for protecting routes and validating user authentication.
 * Uses JWT tokens for authentication and session tokens for session management.
 */
class Authentication {
  constructor() {
    this.service = require("../users/user.service.js");
  }

  /**
   * Private Method: Check User Authentication and Authorization
   * 
   * Validates the user's session and checks if the token is still valid.
   * Performs the following checks:
   * 1. Verifies user exists in database
   * 2. Validates session token ID matches stored session
   * 3. Checks if password was changed after token was issued
   * 
   * @private
   * @param {Object} decoded - Decoded JWT token payload
   * @param {Function} next - Express next middleware function
   * @returns {Object|void} - Returns user object if valid, otherwise calls next with error
   */
  async #checkUser(decoded, next) {
    // Retrieve user from database using userId from token
    const currentUser = await this.service.getOneById(decoded.userId);

    // Check if user exists
    if (!currentUser) {
      return next(
        ApiError.unauthorized("Invalid token, please login again...")
      );
    }

    // Verify session token ID matches stored session
    // This ensures the token is from the current active session
    const isValidSessionTokenId = await Hash.compareKeys(
      decoded.sessionTokenId,
      currentUser.sessionTokenId
    );

    if (!isValidSessionTokenId) {
      return next(
        ApiError.unauthorized("Session expired, please login again...", 401)
      );
    }

    // Check if password was changed after token was issued
    // If password was changed, the token becomes invalid
    if (currentUser.passwordChangedAt) {
      const passwordChangedAtTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      // Compare password change time with token issued time (iat)
      if (passwordChangedAtTimestamp > decoded.iat) {
        return next(
          ApiError.unauthorized(
            `user recently changed password, please login again...`
          )
        );
      }
    }

    return currentUser;
  }

  /**
   * Protect Middleware
   * 
   * Main authentication middleware that protects routes requiring authentication.
   * 
   * Process:
   * 1. Extracts JWT token from Authorization header
   * 2. Verifies token signature and expiration
   * 3. Validates user session
   * 4. Attaches userId and user object to request
   * 
   * @param {Express.Request} req - Express request object
   * @param {Express.Response} res - Express response object
   * @param {Function} next - Express next middleware function
   * 
   * @example
   * // Usage in routes:
   * router.use(protect);
   * // or
   * router.get('/tasks', protect, taskController.getAllTasks);
   */
  protect = asyncHandler(async (req, res, next) => {
    // Extract token from Authorization header
    let token = req.headers.authorization;

    // Check if token exists
    if (!token) {
      return next(
        ApiError.unauthorized("You are not logged in, please login...")
      );
    }

    // Verify and decode JWT token
    const decoded = await jwt.verify(token, config.JWT_SECRET);

    // Check if token has expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp) {
      return next(
        ApiError.unauthorized("Token has expired, please login again...")
      );
    }

    // Validate user session and get current user
    const currentUser = await this.#checkUser(decoded, next);

    // Attach user information to request object for use in route handlers
    req.userId = decoded.userId;
    req.user = currentUser;
    next();
  });

  /**
   * Role-Based Access Control Middleware
   * 
   * Restricts route access based on user roles.
   * 
   * @param {...string} roles - Allowed roles for the route
   * @returns {Function} - Express middleware function
   * 
   * @example
   * // Usage in routes:
   * router.get('/admin/users', protect, allowedTo('admin'), userController.getAllUsers);
   */
  allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
      // Check if user's role is in the allowed roles list
      if (!roles.includes(req.role)) {
        return next(ApiError.forbidden("Not allowed to access this route"));
      }
      next();
    });
}

module.exports = new Authentication();
