const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require("../utils/status-codes");

const errorHandler = (err, _req, res, _next) => {
  // Debug logging
  console.error("=== ERROR DEBUG ===");
  console.error("Error object:", err);
  console.error("Error name:", err.name);
  console.error("Error message:", err.message);
  console.error("Error statusCode:", err.statusCode);
  console.error("Error stack:", err.stack);
  console.error("===================");

  const { statusCode = INTERNAL_SERVER_ERROR_STATUS_CODE, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR_STATUS_CODE
        ? "An error occurred on the server"
        : message,
  });
};

module.exports = errorHandler;
