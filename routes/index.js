const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

router.use("/items", clothingItems);
router.use("/users", users);

module.exports = router;
