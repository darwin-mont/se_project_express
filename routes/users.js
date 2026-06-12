const router = require("express").Router();
const {
  createUser,
  logIn,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

// Public routes
router.post("/signup", createUser);
router.post("/signin", logIn);

// Protected routes (requires authentication)
router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
