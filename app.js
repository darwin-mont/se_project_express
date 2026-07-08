require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const router = require("./routes/index");

const { requestLogger, errorLogger } = require("./middlewares/logger");

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
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn("Origin not allowed by CORS:", origin);
        callback(null, true); // Temporarily allow all for testing
        // callback(new Error('Not allowed by CORS')); // Enable for production
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// === LOGGERs === //
app.use(requestLogger);

// === MongoDB connection === //

const DB_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/wtwr_db";

mongoose
  .connect(DB_URL)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB error:", err));

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
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
