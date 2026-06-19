const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const { createUser, logIn } = require("../controllers/users");

const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");

// PUBLIC ROUTES (no authentication)
router.post("/signin", logIn);
router.post("/signup", createUser);

router.use("/items", clothingItems);
router.use("/users", users);

// 404 Handler - for no found routes
router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
