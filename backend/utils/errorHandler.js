// backend/utils/errorHandler.js

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Captures the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
