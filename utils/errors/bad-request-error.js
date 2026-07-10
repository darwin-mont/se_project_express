const CustomError = require("./custom-error");
const { BAD_REQUEST_STATUS_CODE } = require("../status-codes");

class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, BAD_REQUEST_STATUS_CODE);
  }
}

module.exports = BadRequestError;
