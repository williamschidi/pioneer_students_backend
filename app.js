const express = require("express");

const memberRouter = require("./router/memberRouter");
const stateRouter = require("./router/stateRouter");
const adminRouter = require("./router/adminRouter");
const cookieParser = require("cookie-parser");

const app = express();

// middleware to parse json
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/members", memberRouter);
app.use("/api/v1/states", stateRouter);
app.use("/api/v1/admin", adminRouter);

module.exports = app;
