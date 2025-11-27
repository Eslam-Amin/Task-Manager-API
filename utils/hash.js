/**
 * Hash Utility Module
 * 
 * This module provides utilities for hashing and comparing sensitive data
 * such as passwords and session tokens using bcrypt.
 * 
 * @module utils/hash
 */

const bcrypt = require("bcrypt");
const config = require("../config");

/**
 * Hash Utility Class
 * 
 * Provides static methods for hashing and comparing keys (passwords, tokens, etc.)
 * using bcrypt with configurable salt rounds.
 */
class Hash {
  /**
   * Hash a Key (Password, Token, etc.)
   * 
   * Hashes a plain text key using bcrypt with the configured salt rounds.
   * This is a one-way hashing operation - the original key cannot be recovered.
   * 
   * @param {string} key - Plain text key to hash (password, token, etc.)
   * @returns {Promise<string>} - Hashed key
   * @throws {Error} - If key is not provided
   * 
   * @example
   * const hashedPassword = await Hash.hashKey('myPassword123');
   * // Returns: '$2b$10$...' (bcrypt hash)
   */
  static async hashKey(key) {
    if (!key) throw new Error("Key is required for hashing");

    // Get salt rounds from configuration (default: 10)
    const saltRounds = parseInt(config.SALT_ROUNDS) || 10;
    
    // Hash the key using bcrypt
    return bcrypt.hash(key, saltRounds);
  }

  /**
   * Compare a Key with a Hashed Key
   * 
   * Compares a plain text key with a hashed key to verify if they match.
   * This is used for password verification and session token validation.
   * 
   * @param {string} key - Plain text key to compare
   * @param {string} hashedKey - Hashed key to compare against
   * @returns {Promise<boolean>} - True if keys match, false otherwise
   * 
   * @example
   * const isValid = await Hash.compareKeys('myPassword123', hashedPassword);
   * // Returns: true if password matches, false otherwise
   */
  static async compareKeys(key, hashedKey) {
    // Return false if either key is missing
    if (!key || !hashedKey) return false;
    
    // Compare keys using bcrypt
    return bcrypt.compare(key, hashedKey);
  }
}

module.exports = Hash;
