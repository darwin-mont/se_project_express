const CustomError = require("./custom-error");
const { NOT_FOUND_STATUS_CODE } = require("../status-codes");

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, NOT_FOUND_STATUS_CODE);
  }
}

module.exports = NotFoundError;
