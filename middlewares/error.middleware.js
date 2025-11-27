const config = require("../config");
const ApiError = require("../utils/ApiError");

const sendErrorForDev = (err, res) => {
  console.log("🚀 ~ sendErrorForDev ~ err:", err);
  res.status(err.statusCode).json({
    success: err.success || false,
    message: err.message || "Something went wrong",
    stack: err.stack
  });
};

const sendErrorForProd = (err, res) => {
  if (!err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: "Something went wrong"
    });
  } else {
    // For other status codes
    res.status(err.statusCode).json({
      success: err.success || false,
      message: err.message
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return ApiError.badRequest(message);
};

const handleDuplicatedFieldsDB = (error) => {
  const duplicateKey = Object.keys(error.keyPattern)[0]; // Extracting the duplicate key field
  let message = `${duplicateKey} is already used`;

  return ApiError.badRequest(message);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => {
    return el.message;
  });
  const message = `Invalid Input Data ${errors.join(". ")}`;
  return ApiError.badRequest(message);
};

const handleInvalidJwtSignature = (_) =>
  ApiError.unauthorized("Invalid token, Please login again ...");

const handleJwtExpired = (_) =>
  ApiError.unauthorized("Expired token, Please login again ...");

const globalError = (err, req, res, next) => {
  err.success = err.success || false;
  err.statusCode = err.statusCode || 500;
  let error = { ...err };
  error.message = err.message;
  switch (err.name) {
    case "JsonWebTokenError":
      error = handleInvalidJwtSignature();
      break;
    case "TokenExpiredError":
      error = handleJwtExpired();
      break;
    case 11000:
      error = handleDuplicatedFieldsDB(err);
      break;
    case "CastError":
      error = handleCastErrorDB(err);
      break;
    case "ValidationError":
      error = handleValidationError(err);
      break;
  }
  if (config.NODE_ENV === "development") {
    sendErrorForDev(error, res);
  } else {
    sendErrorForProd(error, res);
  }
};

module.exports = globalError;
