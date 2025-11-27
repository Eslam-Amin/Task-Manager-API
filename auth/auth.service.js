const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

class AuthSerivce {
  constructor() {
    this.userService = require("../users/user.service");
  }

  async registerOne(data) {
    try {
      const user = await this.userService.createOne(data);
      return user;
    } catch (error) {
      next(error);
    }
  }

  async login(email, password) {
    const user = await this.userService.getOneByEmail(email);
    if (!user) {
      throw ApiError.unauthorized(`Incorrect email or password`);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw ApiError.unauthorized(`Incorrect email or password`);
    }
    const token = await user.generateToken();
    return { user, token };
  }
}

module.exports = new AuthSerivce();
