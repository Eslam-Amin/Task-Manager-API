// Hash utility for bcrypt operations on passwords and session tokens.
// Uses configurable salt rounds from environment variables.

const bcrypt = require("bcrypt");
const config = require("../config");

/**
 * Hash Utility Class
 *
 * Provides static methods for hashing and comparing keys (passwords, tokens, etc.)
 * using bcrypt with configurable salt rounds.
 */
class Hash {
  // Hashes plain text key (password, token) using bcrypt.
  // One-way operation: original key cannot be recovered.
  static async hashKey(key) {
    if (!key) throw new Error("Key is required for hashing");

    // Get salt rounds from configuration (default: 10)
    const saltRounds = parseInt(config.SALT_ROUNDS) || 10;

    // Hash the key using bcrypt
    return bcrypt.hash(key, saltRounds);
  }

  // Compares plain text key with hashed key to verify match.
  // Returns false if either key is missing.
  static async compareKeys(key, hashedKey) {
    // Return false if either key is missing
    if (!key || !hashedKey) return false;

    // Compare keys using bcrypt
    return bcrypt.compare(key, hashedKey);
  }
}

module.exports = Hash;
