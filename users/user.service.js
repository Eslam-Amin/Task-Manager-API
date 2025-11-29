/**
 * User Service
 *
 * This module contains the business logic for user-related operations.
 * It handles user creation, retrieval, updating, and deletion.
 *
 * @module users/user.service
 */

const Hash = require("../utils/hash");
const ApiError = require("../utils/ApiError");

/**
 * User Service Class
 *
 * Provides methods for managing user data in the database.
 * All database operations are performed through Mongoose models.
 */
class UserService {
  constructor() {
    this.UserModel = require("./user.model");
  }

  /**
   * Create a New User
   *
   * Creates a new user in the database with hashed password.
   *
   * @param {Object} data - User data
   * @param {string} data.password - Plain text password (will be hashed)
   * @param {Object} ...data - Other user fields (firstName, lastName, email, etc.)
   * @returns {Promise<Object>} - Created user object
   * @throws {Error} - If user creation fails (e.g., duplicate email)
   */
  async createOne(data) {
    // Hash the password before storing
    const hashedPassword = await Hash.hashKey(data.password);

    // Create new user instance with hashed password
    const user = new this.UserModel({ ...data, password: hashedPassword });

    // Save user to database
    return await user.save();
  }

  /**
   * Get All Users
   *
   * Retrieves all users from the database.
   *
   * @returns {Promise<Array>} - Array of user objects
   */
  async getAll() {
    return await this.UserModel.find();
  }

  /**
   * Get User by ID
   *
   * Retrieves a single user by their MongoDB ObjectId.
   *
   * @param {string} id - User's MongoDB ObjectId
   * @returns {Promise<Object>} - User object
   * @throws {ApiError} - If user is not found (404)
   */
  async getOneById(id) {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }

    return user;
  }

  /**
   * Get User by Email
   *
   * Retrieves a user by their email address.
   * Uses case-insensitive collation for email matching.
   *
   * @param {string} email - User's email address
   * @returns {Promise<Object|null>} - User object if found, null otherwise
   */
  async getOneByEmail(email) {
    // Case-insensitive email search using MongoDB collation
    const user = await this.UserModel.findOne({ email }).collation({
      locale: "en",
      strength: 2 // Case-insensitive comparison
    });

    return user;
  }

  /**
   * Update User
   *
   * Updates user information in the database.
   *
   * @param {string} id - User's MongoDB ObjectId
   * @param {Object} data - Updated user data
   * @returns {Promise<Object>} - Updated user object
   * @throws {ApiError} - If user is not found (404)
   */
  async updateOne(id, data, userId) {
    if (id !== userId) {
      throw ApiError.forbidden(`You are not allowed to access this user`);
    }
    const hashedPassword = await Hash.hashKey(data.password);
    data.password = hashedPassword;
    data.passwordChangedAt = Date.now();
    // Update user and return updated document
    const user = await this.UserModel.findByIdAndUpdate(id, data, {
      new: true // Return updated document instead of original
    });

    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }

    return user;
  }

  /**
   * Delete User
   *
   * Deletes a user from the database.
   *
   * @param {string} id - User's MongoDB ObjectId
   * @returns {Promise<Object>} - Deleted user object
   * @throws {ApiError} - If user is not found (404)
   */
  async deleteOne(id, userId) {
    if (id !== userId) {
      throw ApiError.forbidden(`You are not allowed to access this user`);
    }
    const user = await this.UserModel.findByIdAndDelete(id);

    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }

    return user;
  }
}

module.exports = new UserService();
