// Authentication middleware protects routes by validating JWT tokens and user sessions.
// Handles token verification, session validation, and role-based access control.

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

  // Validates user session by checking:
  // 1. User exists in database
  // 2. Session token ID matches stored session (prevents token reuse after logout)
  // 3. Password wasn't changed after token was issued (invalidates old tokens)
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

  // Main authentication middleware. Extracts JWT from Authorization header,
  // verifies signature and expiration, validates session, then attaches user to request.
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

  // Role-based access control. Restricts route access to specified roles.
  // Usage: router.get('/admin', protect, allowedTo('admin'), handler)
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
