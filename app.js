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

app.use((req, res, next) => {
  req.user = {
    _id: "6a25eb0eb4e9d2d9f5c51e64", // Use a valid user ID from your database
  };
  next();
});

// Routes - ONLY use mainRouter
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
