const CustomError = require("./custom-error");
const { FORBIDDEN_STATUS_CODE } = require("../status-codes");

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN_STATUS_CODE);
  }
}

module.exports = ForbiddenError;
