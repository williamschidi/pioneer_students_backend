const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const memberRouter = require("./router/memberRouter");
const stateRouter = require("./router/stateRouter");
const adminRouter = require("./router/adminRouter");

const app = express();

const loginLimiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many request from this IP. Please try again after one hour.",
});

const generalLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many request from this IP. Please try again after one hour.",
});

app.use(
  cors({
    origin: "https://pioneer-students-of-st-marks-sec-sch.netlify.app",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(helmet());

app.use("/api/v1/register", generalLimiter, memberRouter);
app.use("/api/v1/states", generalLimiter, stateRouter);
app.use("/api/v1/admin", loginLimiter, adminRouter);

module.exports = app;
