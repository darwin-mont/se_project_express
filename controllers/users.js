const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  CONFLICT_STATUS_CODE,
} = require("../utils/errors");

const logIn = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ data: user, token });
    })
    .catch((err) =>
      res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: err.message || "incorrect email or password" })
    );
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;
  if (!email || !password || !name || !avatar) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "All fields are required" });
  }

  return User.create({ email, password, name, avatar })
    .then((user) =>
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CONFLICT_STATUS_CODE)
          .send({ message: "User with this email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "create User Failed", error: err.message });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "User not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "get User Failed", error: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "User not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "update Profile Failed", error: err.message });
    });
};

module.exports = { createUser, logIn, getCurrentUser, updateProfile };
