const bcrypt = require("bcrypt");

class UserService {
  constructor() {
    this.UserModel = require("./user.model");
  }

  async createOne(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.UserModel({ ...data, password: hashedPassword });
    return await user.save();
  }

  async getAll() {
    return await this.UserModel.find();
  }

  async getOneById(id) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }
    return user;
  }

  async getOneByEmail(email) {
    const user = await this.UserModel.findOne({ email }).collation({
      locale: "en",
      strength: 2
    });
    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }
    return user;
  }

  async updateOne(id, data) {
    const user = await this.UserModel.findByIdAndUpdate(id, data, {
      new: true
    });
    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }
    return user;
  }

  async deleteOne(id) {
    const user = await this.UserModel.findByIdAndUpdate(id);
    if (!user) {
      throw ApiError.notFound(`User is not found`);
    }
    return user;
  }
}

module.exports = new UserService();
