const path = require("path");
const fs = require("fs");

// Load the API documentation from JSON file
const swaggerJsonPath = path.join(__dirname, "..", "api-docs.json");
const swaggerSpec = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf8"));

module.exports = swaggerSpec;
