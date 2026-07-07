const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/index");
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require("./utils/errors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const app = express();

const errorHandler = require("./middlewares/errorHandler");

// === MIDDLEWARES === //

app.use(cors({}));
app.use(express.json());

// === LOGGERs === //
app.use(requestLogger);

// === MongoDB connection === //

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

// === ROUTES - Main route === //
app.use("/", router);

app.use(errorLogger);

// === Global error handler === //

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

// === CELEBRATE ERROR HANDLER === //

app.use(errors());

// === GLOBAL ERROR HANDLER === //

app.use(errorHandler);

// === START SERVER === //
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
