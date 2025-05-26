const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const memberRouter = require("./router/memberRouter");
const stateRouter = require("./router/stateRouter");
const adminRouter = require("./router/adminRouter");

const app = express();

const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many request from this IP. Please try again after one hour.",
});

app.use(
  cors({
    origin: "https://pioneer-students-of-st-marks-sec-sch.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use("/", limiter);
app.use(helmet());

app.use("/api/v1/register", memberRouter);
app.use("/api/v1/states", stateRouter);
app.use("/api/v1/admin", adminRouter);

module.exports = app;

// const express = require('express');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// const globalError = require('./Controller/errorController');

// const studentsRoute = require('./Route/regRoute');
// const adminRoute = require('./Route/adminRoute');
// const customError = require('./util/customError');

// const app = express();
// const limiter = rateLimit({
//   max: 5,
//   windowMs: 60 * 60 * 1000,
//   message:
//     'We have received too many request from this IP. Please try again after one hour.',
// });
// app.use('/', limiter);
// app.use(helmet());
// app.use(cors());
// app.use(express.json({ limit: '10kb' }));
// app.use(cookieParser());

// app.use('/api/v1/student/register', studentsRoute);
// app.use('/api/v1/admin', adminRoute);
// app.all('*', (req, res, next) => {
//   const err = new customError(
//     `Can't find the ${req.originalUrl} on the server`,
//     404,
//   );
//   next(err);
// });

// app.use(globalError);

// module.exports = app;
