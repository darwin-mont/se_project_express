const User = require("../models/user");

// the getUsers request handler

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

// the getUser request handler

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

// the createUser request handler

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

module.exports = { getUsers, getUser, createUser };
