const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

// === LOGIN === //
const logIn = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and Password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({
        token,
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(err.message));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invaid user ID format"));
      }
      next(err);
    });
};

// === CREATE USER (REGISTER) === //
const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password || !name) {
    return next(new BadRequestError("Email, password, and name are required"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        email,
        name,
        avatar,
        password: hashedPassword,
      })
    )
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("User with this email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      next(err);
    });
};

// === GET CURRENT USER === //
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(200).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      next(err);
    });
};

// === UPDATE PROFILE === ///
const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name && !avatar) {
    return next(new "At least one field (name or avatar) is required"());
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.status(200).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      next(err);
    });
};

module.exports = { createUser, logIn, getCurrentUser, updateProfile };
