const User = require("../models/user");

// the getUsers request handler

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) =>
      res.status(500).send({ message: "get Users Failed", error: err })
    );
};
// the getUser request handler

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "get User Failed", error: err })
    );
};

// the createUser request handler

const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "create User Failed", error: err });
    });
};

module.exports = { getUsers, getUser, createUser };
