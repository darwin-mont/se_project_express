const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const mainRouter = require("./routes/index");
const { createUser, logIn } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", usersRouter);

// MongoDB connection

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

// Public routes (no authentication required)
app.post("/signin", logIn);
app.post("/signup", createUser);

// Protected routes (authentication required)
app.use(auth);
app.use("/", usersRouter);

// 404 handler - Error handling for unmatched routes
app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

// Global error handler - Error handling for all other errors
app.use((err, req, res) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

// Routes - ONLY use mainRouter
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
