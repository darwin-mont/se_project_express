const { SOME_ERROR_CODE } = require("../utils/errors");

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "SomeErrorName") {
        return res
          .status(SOME_ERROR_CODE)
          .send({ message: "Appropriate error message" });
      } else {
        // if no errors match, return a response with status code 500
        return res.status(500).send({ message: "Internal server error" });
      }
    });
};

exports.createUser = createUser;
