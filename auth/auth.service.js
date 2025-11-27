/**
 * Authentication Service
 * 
 * This module contains the business logic for user authentication operations,
 * including user registration and login functionality.
 * 
 * @module auth/auth.service
 */

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

  /**
   * Register a New User
   * 
   * Creates a new user account by delegating to the UserService.
   * The UserService handles password hashing and user creation.
   * 
   * @param {Object} data - User registration data
   * @param {string} data.firstName - User's first name
   * @param {string} data.lastName - User's last name
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password (will be hashed)
   * @param {string} data.phone - User's phone number
   * @param {string} data.gender - User's gender (male/female)
   * @param {Date} data.dateOfBirth - User's date of birth
   * @returns {Promise<Object>} - Created user object
   * @throws {ApiError} - If user creation fails
   */
  async registerOne(data) {
    const user = await this.userService.createOne(data);
    return user;
  }

  /**
   * User Login
   * 
   * Authenticates a user by verifying email and password.
   * If authentication is successful, generates a JWT token.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's plain text password
   * @returns {Promise<Object>} - Object containing user and JWT token
   * @returns {Object} user - User object
   * @returns {string} token - JWT authentication token
   * @throws {ApiError} - If email or password is incorrect
   * 
   * @example
   * const { user, token } = await authService.login('user@example.com', 'password123');
   */
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
