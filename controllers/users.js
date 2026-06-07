const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users })) // Fixed: removed {} and return
    .catch((err) =>
      res.status(500).send({ message: "get Users Failed", error: err })
    ); // Fixed: removed {} and return
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID format" });
      }
      return res.status(500).send({ message: "get User Failed", error: err });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user })) // Fixed: removed {} and return
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res
          .status(409)
          .send({ message: "User with this name already exists" });
      }
      return res
        .status(500)
        .send({ message: "create User Failed", error: err });
    });
};

module.exports = { getUsers, getUser, createUser };
