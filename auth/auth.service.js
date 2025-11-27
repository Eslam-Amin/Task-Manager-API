const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const Hash = require("../utils/hash");

class AuthSerivce {
  constructor() {
    this.userService = require("../users/user.service");
  }

  async registerOne(data) {
    const user = await this.userService.createOne(data);
    return user;
  }

  async login(email, password) {
    const user = await this.userService.getOneByEmail(email);
    if (!user) {
      throw ApiError.unauthorized(`Incorrect email or password`);
    }
    const isValidPassword = await Hash.compareKeys(password, user.password);
    if (!isValidPassword) {
      throw ApiError.unauthorized(`Incorrect email or password`);
    }
    const token = await user.generateToken();
    return { user, token };
  }
}

module.exports = new AuthSerivce();
