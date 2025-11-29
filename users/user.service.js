// User service handles business logic for user operations.
// Manages password hashing, user CRUD operations, and case-insensitive email lookups.

const Hash = require("../utils/hash");
const ApiError = require("../utils/ApiError");

class UserService {
  constructor() {
    this.UserModel = require("./user.model");
  }

  // Creates new user with hashed password
  async createOne(data) {
    // Hash the password before storing
    const hashedPassword = await Hash.hashKey(data.password);

    // Create new user instance with hashed password
    const user = new this.UserModel({ ...data, password: hashedPassword });

    // Save user to database
    return await user.save();
  }

  // Retrieves all users from database
  async getAll() {
    return await this.UserModel.find();
  }

  // Retrieves user by MongoDB ObjectId, throws 404 if not found
  async getOneById(id) {
    const user = await this.UserModel.findById(id);

    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }

    return user;
  }

  // Retrieves user by email with case-insensitive matching
  async getOneByEmail(email) {
    // Case-insensitive email search using MongoDB collation
    const user = await this.UserModel.findOne({ email }).collation({
      locale: "en",
      strength: 2 // Case-insensitive comparison
    });

    return user;
  }

  // Updates user and returns updated document
  async updateOne(id, data) {
    const user = await this.UserModel.findByIdAndUpdate(id, data, {
      new: true
    });

    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }

    return user;
  }

  // Deletes user and returns deleted document
  async deleteOne(id) {
    const user = await this.UserModel.findByIdAndDelete(id);

    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }

    return user;
  }
}

module.exports = new UserService();
