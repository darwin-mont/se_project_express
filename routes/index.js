const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");

router.use("/items", clothingItems);
router.use("/users", users);

router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
