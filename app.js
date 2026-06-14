const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const clothingItemsRouter = require("./routes/clothingItems");
const {
  createUser,
  logIn,
  getCurrentUser,
  updateProfile,
} = require("./controllers/users");

const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

// PUBLIC ROUTES (no authentication)
app.post("/signin", logIn);
app.post("/signup", createUser);

// PROTECTED ROUTES - AUTH MIDDLEWARE MUST COME BEFORE THESE
app.use(auth);

// User routes (protected)
app.get("/me", getCurrentUser);
app.patch("/me", updateProfile);

// Items routes (protected)
app.use("/items", clothingItemsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
