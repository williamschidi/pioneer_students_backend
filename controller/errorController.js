const CustomError = require("./../utils/customError");

function dev(res, error) {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
}

function handleCastError(error) {
  const err = `Invalid ${error.path} (${error.value}).Please provide a valid ID`;
  return new CustomError(err, 400);
}

function handleDuplicateKey(error) {
  const field = Object.keys(error.keyValue)[0];

  const name = error.keyValue[field];
  const err = `${name} already exist in the database. Please use another name.`;
  return new CustomError(err, 400);
}

function handleValidationError(error) {
  const values = Object.values(error.errors).map((value) => value.message);
  const err = values.join(". ");
  return new CustomError(err, 400);
}

function prod(res, error) {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later",
    });
  }
}

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";

  if (process.env.NODE_ENV === "development") {
    dev(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateKey(error);
    if (error.name === "ValidationError") error = handleValidationError(error);

    prod(res, error);
  }
};
