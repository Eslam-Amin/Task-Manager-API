const authService = require("./auth.service");
const UserDto = require("../users/user.dto");

class AuthController {
  constructor() {}

  async registerOne(req, res, next) {
    try {
      const user = await authService.registerOne(req.body);
      res.status(200).json({
        success: true,
        message: "User created successfully",
        data: new UserDto(user)
      });
    } catch (error) {
      next(error);
    }
  }

  async loginOne(req, res, next) {
    try {
      const { user, token } = await authService.login(
        req.body.email,
        req.body.password
      );
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: { ...new UserDto(user), token }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
