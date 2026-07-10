const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  if (!token) {
    return next(new UnauthorizedError("Authorization required"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Invalid token"));
    }
    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token expired"));
    }
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

module.exports = auth;
