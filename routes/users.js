const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateProfile } = require("../middlewares/validation");

// Protected routes (requires authentication)
router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateProfile, updateProfile);

module.exports = router;
