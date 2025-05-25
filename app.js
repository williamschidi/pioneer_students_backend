const express = require("express");

const memberRouter = require("./router/memberRouter");
const stateRouter = require("./router/stateRouter");
const adminRouter = require("./router/adminRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// enable cors for frontend

app.use(
  cors({
    origin: "https://pioneer-students-of-st-marks-sec-sch.netlify.app",
    credentials: true,
  })
);

// middleware to parse json
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/register", memberRouter);
app.use("/api/v1/states", stateRouter);
app.use("/api/v1/admin", adminRouter);

module.exports = app;
