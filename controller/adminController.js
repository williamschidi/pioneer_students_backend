const Admin = require("./../modal/adminModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");

// console.log(require("crypto").randomBytes(64).toString("hex"));

const signToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.SECRET_WORD, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });
};

exports.getAllAdmins = asyncErrorHandler(async (req, res, next) => {
  const allAdmins = await Admin.find();
  res.status(200).json({
    status: "success",
    count: allAdmins.length,
    data: {
      allAdmins,
    },
  });
});

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newAdmin = await Admin.create(req.body);

  const token = signToken(newAdmin._id, res);

  res.status(200).json({
    status: "success",
    token,
    data: {
      newAdmin,
    },
  });
});

exports.updateAdmin = asyncErrorHandler(async (req, res, next) => {
  const updateAdminData = await Admin.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateAdminData) {
    return next(
      new CustomError("Admin not found. please provide a valid ID", 400)
    );
  }

  res.status(200).json({
    status: "Success",
    data: {
      updateAdminData,
    },
  });
});

exports.deleteAdmin = asyncErrorHandler(async (req, res, next) => {
  const deleteAdminData = await Admin.findByIdAndDelete(req.params.id);
  if (!deleteAdminData) {
    return next(
      new CustomError("Admin not found. Please provide a valid ID", 400)
    );
  }

  res.status(201).json({
    status: "success",
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Please provide Email and Password", 400));
  }

  const adminLogin = await Admin.findOne({ email }).select("+password");

  const isMatch = await adminLogin.comparePassword(
    password,
    adminLogin.password
  );

  if (!adminLogin || !isMatch) {
    return next(
      new CustomError(
        "Password does not match. please provide a correct password",
        400
      )
    );
  }

  const token = signToken(adminLogin._id, res);

  res.status(200).json({
    status: "success",
    token,
    data: {
      name: adminLogin.firstName,
    },
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new CustomError("You are not loggedIn. Please login", 401));
  }

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_WORD
  );

  const currentUser = await Admin.findById(decodedToken.id);
  if (!currentUser) {
    return next(new CustomError("Admin with given token does not exit", 401));
  }

  req.admin = currentUser;
  next();
});

exports.logout = (req, res) => {
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
