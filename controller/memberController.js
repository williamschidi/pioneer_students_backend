const Members = require("../modal/memberModel");

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  try {
    const members = await Members.find({}, "firstName lastName email phone")
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Members.countDocuments();
    res.status(200).json({
      status: "success",
      data: {
        members,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    err.status(500).json({
      error: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newMember = await Members.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Member successfully created",
      data: {
        newMember,
      },
    });
  } catch (err) {
    res.status(400).json({
      error: err.stack,
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

exports.getUser = async (req, res) => {
  try {
    const member = await Members.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found. Please provide a valid ID",
      });
    }
    res.status(200).json({
      status: " success",
      data: {
        member,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
