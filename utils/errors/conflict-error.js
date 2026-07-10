const CustomError = require("./custom-error");
const { CONFLICT_STATUS_CODE } = require("../status-codes");

class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(message, CONFLICT_STATUS_CODE);
  }
}

module.exports = ConflictError;
