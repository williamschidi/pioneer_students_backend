const express = require("express");

const memberRouter = require("./router/memberRouter");
const stateRouter = require("./router/stateRouter");

const app = express();

// middleware to parse json
app.use(express.json());
app.use("/api/v1/members", memberRouter);
app.use("/api/v1/states", stateRouter);

module.exports = app;
