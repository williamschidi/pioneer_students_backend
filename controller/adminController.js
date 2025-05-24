const Admin = require("./../modal/adminModel");
const jwt = require("jsonwebtoken");
const util = require("util");

// console.log(require("crypto").randomBytes(64).toString("hex"));

const signToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.SECRET_WORD, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
};

exports.getAllAdmins = async (req, res, next) => {
  try {
    const allAdmins = await Admin.find();
    res.status(200).json({
      status: "success",
      count: allAdmins.length,
      data: {
        allAdmins,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const newAdmin = await Admin.create(req.body);

    const token = signToken(newAdmin._id, res);

    res.status(200).json({
      status: "success",
      token,
      data: {
        newAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const updateAdminData = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateAdminData) {
      return res.status(400).json({
        message: "Admin not found. please provide a valid ID.",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        updateAdminData,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    const deleteAdminData = await Admin.findByIdAndDelete(req.params.id);
    if (!deleteAdminData) {
      return res.status(400).json({
        message: "Admin not found. Please provide a valid ID",
      });
    }

    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide Email and Password.",
      });
    }

    const adminLogin = await Admin.findOne({ email }).select("+password");

    const isMatch = await adminLogin.comparePassword(
      password,
      adminLogin.password
    );

    if (!adminLogin || !isMatch) {
      return res.status(400).json({
        message: "Password does not match. please provide a correct password",
      });
    }

    const token = signToken(adminLogin._id, res);

    res.status(200).json({
      status: "success",
      token,
      data: {
        name: adminLogin.firstName,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        status: "Failed",
        message: "You are not loggedIn. Please login",
      });
    }

    const decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.SECRET_WORD
    );

    const currentUser = await Admin.findById(decodedToken.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "Failed",
        message: "Admin with given token does not exit",
      });
    }

    req.admin = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "Failed",
      message: "Authentication failed. Please login",
    });
  }
};

exports.logout = (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

exports.verified = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      username: req.admin.firstName,
    },
  });
};
