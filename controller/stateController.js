const States = require("./../modal/stateModel");

exports.CreateStates = async (req, res, next) => {
  try {
    const createdStates = await States.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        states: createdStates,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const getStates = await States.find({ isActive: true })
      .select("state value localGovernments")
      .sort({ state: 1 });
    res.status(200).json({
      data: {
        getStates,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateState = async (req, res) => {
  try {
    const UpdatedState = await States.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!UpdatedState) {
      return res.status(404).json({
        message: "State not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        UpdatedState,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteState = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteState = await States.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, runValidators: true }
    );

    if (!deleteState) {
      return res.status(404).json({
        message: "State not found",
      });
    }

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
