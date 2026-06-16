const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");

const {
  createUser,
  logIn,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

const auth = require("../middlewares/auth");
const { getItems } = require("../controllers/clothingItems");
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");

// PUBLIC ROUTES (no authentication)
router.post("/signin", logIn);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use("/items", clothingItems);
router.use("/users", users);

// PROTECTED ROUTES - AUTH MIDDLEWARE MUST COME BEFORE THESE
router.use(auth);

// User routes (protected)
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

// 404 Handler - for no found routes
router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
