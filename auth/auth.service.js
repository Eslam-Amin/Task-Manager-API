// Authentication service handles user registration and login operations.
// Delegates user data operations to UserService while managing authentication flow.

const ApiError = require("../utils/ApiError");
const Hash = require("../utils/hash");

/**
 * Authentication Service Class
 *
 * Handles authentication-related business logic such as user registration
 * and login. Delegates user operations to the UserService.
 */
class AuthService {
  constructor() {
    this.userService = require("../users/user.service");
  }

  // Creates a new user account. Password hashing is handled by UserService.
  async registerOne(data) {
    const user = await this.userService.createOne(data);
    return user;
  }

  // Authenticates user credentials and returns user data with JWT token.
  // Throws unauthorized error if email doesn't exist or password is incorrect.
  async login(email, password) {
    // Find user by email (case-insensitive search)
    const user = await this.userService.getOneByEmail(email);

    // Check if user exists
    if (!user) {
      throw ApiError.unauthorized(`Incorrect email or password`);
    }

    // Verify password by comparing with hashed password
    const isValidPassword = await Hash.compareKeys(password, user.password);

    if (!isValidPassword) {
      throw ApiError.unauthorized(`Incorrect email or password`);
    }

    // Generate JWT token for the authenticated user
    const token = await user.generateToken();

    return { user, token };
  }
}

module.exports = new AuthService();
