class AuthController {
  constructor() {
    this.authService = require("./auth.service");
  }

  async registerOne(req, res, next) {
    try {
      const user = await this.authService.registerOne(req.body);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async loginOne(req, res, next) {
    try {
      const user = await this.authService.loginOne(req.body);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
