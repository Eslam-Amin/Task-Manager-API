// Loads Swagger API documentation specification from JSON file.
// Used by Swagger UI middleware to serve interactive API documentation.

const path = require("path");
const fs = require("fs");

const swaggerJsonPath = path.join(__dirname, "..", "api-docs.json");
const swaggerSpec = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf8"));

module.exports = swaggerSpec;
