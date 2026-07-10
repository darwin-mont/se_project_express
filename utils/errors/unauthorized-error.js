const CustomError = require("./custom-error");
const { UNAUTHORIZED_STATUS_CODE } = require("../status-codes");

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED_STATUS_CODE);
  }
}

module.exports = UnauthorizedError;
