/**
 * Custom API Error Class
 * 
 * This class extends the native Error class to create custom API errors
 * with HTTP status codes. It provides static factory methods for common
 * HTTP error responses.
 * 
 * @module utils/ApiError
 */

/**
 * API Error Class
 * 
 * Custom error class for API responses with HTTP status codes.
 * All errors created with this class are marked as operational,
 * meaning they are expected errors that should be sent to the client.
 */
class ApiError extends Error {
  /**
   * Create a new API Error
   * 
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    
    // Mark as operational error (expected error, not programming error)
    this.isOperational = true;
    
    // HTTP status code
    this.statusCode = statusCode;
    
    // Status text based on status code
    // 4xx = "Failed", 5xx = "Error"
    this.status = `${statusCode}`.startsWith(4) ? "Failed" : "Error";
    
    // Success flag for consistent API responses
    this.success = false;
  }

  /**
   * Create a 400 Bad Request Error
   * 
   * Used for validation errors, malformed requests, etc.
   * 
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance with 400 status code
   */
  static badRequest(message) {
    return new ApiError(message, 400);
  }

  /**
   * Create a 401 Unauthorized Error
   * 
   * Used when authentication is required or has failed.
   * 
   * @param {string} [message="Unauthorized"] - Error message
   * @returns {ApiError} - ApiError instance with 401 status code
   */
  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401);
  }

  /**
   * Create a 403 Forbidden Error
   * 
   * Used when user is authenticated but doesn't have permission.
   * 
   * @param {string} [message="Forbidden"] - Error message
   * @returns {ApiError} - ApiError instance with 403 status code
   */
  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403);
  }

  /**
   * Create a 404 Not Found Error
   * 
   * Used when a requested resource is not found.
   * 
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance with 404 status code
   */
  static notFound(message) {
    return new ApiError(message, 404);
  }

  /**
   * Create a 500 Internal Server Error
   * 
   * Used for unexpected server errors.
   * 
   * @param {string} message - Error message
   * @returns {ApiError} - ApiError instance with 500 status code
   */
  static internal(message) {
    return new ApiError(message, 500);
  }
}

module.exports = ApiError;
