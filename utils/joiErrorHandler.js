const ApiError = require("../utils/ApiError");

function joiErrorHandler(schema, data) {
  const { error } = schema.validate(data);
  if (!error) return;
  let message = error.details[0].message.replace(/"/g, "").split(" ");

  message = message.join(" ").split("_").join(" ");
  message = `${message.charAt(0).toUpperCase()}${message.slice(1)}`;
  throw new ApiError(message, 400);
}

module.exports = joiErrorHandler;
