const CustomError = require("../utils/customError");
const States = require("./../modal/stateModel");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");

exports.CreateStates = asyncErrorHandler(async (req, res, next) => {
  const createdStates = await States.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      states: createdStates,
    },
  });
});

exports.getAllStates = asyncErrorHandler(async (req, res, next) => {
  const getStates = await States.find({ isActive: true })
    .select("state value localGovernments")
    .sort({ state: 1 });
  res.status(200).json({
    data: {
      getStates,
    },
  });
});

exports.updateState = asyncErrorHandler(async (req, res, next) => {
  const UpdatedState = await States.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!UpdatedState) {
    return next(new CustomError("State not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      UpdatedState,
    },
  });
});

exports.deleteState = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const deleteState = await States.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true }
  );

  if (!deleteState) {
    return next(new CustomError("State not found", 404));
  }

  res.status(200).json({
    status: "success",
  });
});
