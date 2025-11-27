const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const Hash = require("../utils/hash.js");

class Authentication {
  constructor() {
    this.service = require("../users/user.service.js");
  }

  // === Check user authentication and authorization ===
  async #checkUser(decoded, next) {
    const currentUser = await this.service.getOneById(decoded.userId);

    if (!currentUser)
      return next(
        ApiError.unauthorized("Invalid token, please login again...")
      );

    const isValidSessionTokenId = await Hash.compareKeys(
      decoded.sessionTokenId,
      currentUser.sessionTokenId
    );

    if (!isValidSessionTokenId)
      return next(
        ApiError.unauthorized("Session expired, please login again...", 401)
      );

    if (currentUser.passwordChangedAt) {
      const passwordChangedAtTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );
      if (passwordChangedAtTimestamp > decoded.iat) {
        return next(
          ApiError.unauthorized(
            `user recently changed password, please login again...`
          )
        );
      }
    }

    return currentUser;
  }

  // === Protect middleware ===
  protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization) token = req.headers.authorization;

    if (!token)
      return next(
        ApiError.unauthorized("You are not logged in, please login...")
      );

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTimestamp)
      return next(
        ApiError.unauthorized("Token has expired, please login again...")
      );

    const currentUser = await this.#checkUser(decoded, next);

    req.userId = decoded.userId;
    req.user = currentUser;
    next();
  });

  // === Role-based access control middleware ===
  allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
      if (!roles.includes(req.role))
        return next(ApiError("Not allowed to access this route", 403));
      next();
    });
}

module.exports = new Authentication();
