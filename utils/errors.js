// utils/errors.js

// ========== HTTP STATUS CODE CONSTANTS ==========
const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;
const NOT_FOUND_STATUS_CODE = 404;
const CONFLICT_STATUS_CODE = 409;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

// ========== CUSTOM ERROR CLASSES ==========

// Base error class
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request
class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, BAD_REQUEST_STATUS_CODE);
  }
}

// 401 - Unauthorized
class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED_STATUS_CODE);
  }
}

// 403 - Forbidden
class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN_STATUS_CODE);
  }
}

// 404 - Not Found
class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, NOT_FOUND_STATUS_CODE);
  }
}

// 409 - Conflict
class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(message, CONFLICT_STATUS_CODE);
  }
}

// ========== EXPORTS ==========
module.exports = {
  // Status codes
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,

  // Error classes
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  CustomError,
};
