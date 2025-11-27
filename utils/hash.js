const bcrypt = require("bcrypt");
const config = require("../config");

class Hash {
  static async hashKey(key) {
    if (!key) throw new Error("Key is required for hashing");

    const saltRounds = parseInt(config.SALT_ROUNDS);
    return bcrypt.hash(key, saltRounds);
  }

  static async compareKeys(key, hashedKey) {
    if (!key || !hashedKey) return false;
    return bcrypt.compare(key, hashedKey);
  }
}

module.exports = Hash;
