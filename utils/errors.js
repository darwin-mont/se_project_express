const User = require("../models/user");

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      // console.error(err); // Remove or comment out

      if (err.name === "SomeErrorName") {
        return res.status(400).send({ message: "Appropriate error message" });
      }
      // if no errors match, return a response with status code 500
      return res.status(500).send({ message: "Internal server error" });
    });
};

exports.createUser = createUser;
