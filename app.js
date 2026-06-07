const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

// Middleware
app.use(express.json());

// Auth middleware (if needed for your routes)
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// Add this middleware BEFORE your routes
app.use((req, res, next) => {
  req.user = {
    _id: "6a258ed88d6744f6aa8f8216", // Use a valid user ID from your database
  };
  next();
});

// Routes - ONLY use mainRouter
app.use("/", mainRouter);

// Remove these lines if they exist:
// const routes = require("./routes");
// app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
