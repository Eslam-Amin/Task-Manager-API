const bcrypt = require("bcrypt");

class UserService {
  constructor() {
    this.UserModel = require("./user.model");
  }

  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.UserModel({ ...data, password: hashedPassword });
    return await user.save();
  }

  async getAllUsers() {
    return await this.UserModel.find();
  }

  async getUserById(id) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }
    return user;
  }

  async updateUser(id, data) {
    const user = await this.UserModel.findByIdAndUpdate(id, data, {
      new: true
    });
    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }
    return user;
  }

  async deleteUser(id) {
    const user = await this.UserModel.findByIdAndUpdate(id);
    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }
    return user;
  }
}

module.exports = new UserService();
