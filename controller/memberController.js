const Members = require("../modal/memberModel");

exports.getAllUsers = async (reg, res) => {
  try {
    const members = await Members.find();
    res.status(200).json({
      status: "success",
      data: {
        members,
      },
    });
  } catch (err) {
    err.status(500).json({
      error: err.message,
    });
  }
};

exports.createUser = async (reg, res) => {
  try {
    const newMember = await Members.create(req.body);
    res.status(201).json({
      status: success,
      data: {
        newMember,
      },
    });
  } catch (err) {
    err.status(400).json({
      error: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updateMember = await Members.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateMember) {
      return res.status(400).json({
        message: "Member not found. Please provide a valid ID",
      });
    }

    res.status(200).json({
      status: success,
      data: {
        updateMember,
      },
    });
  } catch (err) {
    err.status(400).json({
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleteMember = await Members.findByIdAndDelete(req.params.id);
    if (!deleteMember) {
      return res.status(400).json({
        message: "Member not found. Please provide a valid ID",
      });
    }
    res.status(201).json({
      status: success,
    });
  } catch (err) {
    err.status(400).json({
      error: err.message,
    });
  }
};
