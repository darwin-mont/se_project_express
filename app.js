require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const router = require("./routes/index");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const { generalLimiter, authLimiter } = require("./middlewares/rateLimiter");

const { PORT = 3001 } = process.env;
const app = express();
const errorHandler = require("./middlewares/errorHandler");

// === MIDDLEWARES === //

const allowedOrigins = [
  "http://localhost:3001",
  "https://watawe.unibutton.com",
  "https://www.watawe.unibutton.com",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      console.warn("Origin not allowed by CORS:", origin);
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// === LOGGERs === //
app.use(requestLogger);

// === RATE LIMITER === //
app.use(generalLimiter);
app.use("/signin", authLimiter);
app.use("/signup", authLimiter);

// === MongoDB connection === //

const DB_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/wtwr_db";

mongoose
  .connect(DB_URL)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB error:", err));

// === CRASH TEST ENDPOINT === //
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// === ROUTES - Main route === //
app.use("/", router);

app.use(errorLogger);

// === CELEBRATE ERROR HANDLER === //

app.use(errors());

// === GLOBAL ERROR HANDLER === //

app.use(errorHandler);

// === START SERVER === //
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
