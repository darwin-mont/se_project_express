const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/index");
const {
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("./utils/errors");

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

// ROUTES - Main route
app.use("/", router);

// 404 handler
app.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res) => {
  console.error(err);
  const { statusCode = INTERNAL_SERVER_ERROR_STATUS_CODE, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR_STATUS_CODE
        ? "An error occurred on the server"
        : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
