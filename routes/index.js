const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const { createUser, logIn } = require("../controllers/users");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middlewares/validation");

const { NotFoundError } = require("../utils/errors");

// === PUBLIC ROUTES - validation === //
router.post("/signin", validateUserLogin, logIn);
router.post("/signup", validateUserRegistration, createUser);

router.use("/items", clothingItems);
router.use("/users", users);

// 404 Handler - for no found routes
router.use((req, res, next) => {
  const error = new NotFoundError("Requested resource not found");
  next(error);
});

module.exports = router;
