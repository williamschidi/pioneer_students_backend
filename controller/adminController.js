const Admin = require("./../modal/adminModel");
const jwt = require("jsonwebtoken");

// console.log(require("crypto").randomBytes(64).toString("hex"));

const signToken = (id, res) => {
  const token = jwt({ id }, process.env.SECRET_WORD, {
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

    const adminLogin = Admin.findOne({ email }).select("+password");

    const isMatch = adminLogin.comparePassword(password, adminLogin.password);

    if (!adminLogin || !isMatch) {
      return res.status(400).json({
        message: "Password does not match. please provide a correct password",
      });
    }

    const token = signToken(adminLogin._id, res);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.logout = (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

// const jwt = require('jsonwebtoken');
// const { asyncHandler } = require('../util/asyncErrorHandler');
// const admin = require('./../model/adminModel');
// const customError = require('../util/customError');
// const util = require('util');
// const sendEmail = require('./../util/email');
// const crypto = require('crypto');

// const signToken = (id, res) => {
//   const token = jwt.sign({ id }, process.env.SECRET_STR, {
//     expiresIn: process.env.LOGIN_EXPIRES,
//   });

//   res.cookie('jwt', token, {
//     maxAge: 15 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: 'strict',
//     secure: process.env.NODE_ENV !== 'development',
//   });
// };

// exports.signup = asyncHandler(async (req, res, next) => {
//   const createAdmin = await admin.create(req.body);

//   const token = signToken(createAdmin._id, res);
//   res.status(201).json({
//     status: 'success',
//     token,
//     data: {
//       createAdmin,
//     },
//   });
// });

// exports.login = asyncHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     const error = new customError(
//       'Pls provide email and password for login.',
//       400,
//     );
//     return next(error);
//   }

//   const loginAdmin = await admin.findOne({ email }).select('+password');
//   const isMatch = await loginAdmin.comparePassword(
//     password,
//     loginAdmin.password,
//   );

//   if (!loginAdmin || !isMatch) {
//     const error = new customError('Incorrect email or password', 400);
//     return next(error);
//   }

//   const token = signToken(loginAdmin._id, res);

//   res.status(200).json({
//     status: 'success',
//     token,
//   });
// });

// exports.protected = asyncHandler(async (req, res, next) => {
//   // Read the token and check if it exist
//   const testToken = req.cookies.jwt;

//   if (!testToken) {
//     next(new customError('You are not loggedIn. Pls login', 401));
//   }

//   // // Verify the token
//   // // nb verify() is an async function but it does not return a promise.
//   // //  To promisify it, we have to import util library which is inbuilt in node js
//   const decodedToken = await util.promisify(jwt.verify)(
//     testToken,
//     process.env.SECRET_STR,
//   );

//   // check if the user exist
//   const currentAdmin = await admin.findById(decodedToken.id);

//   if (!currentAdmin) {
//     const error = new customError(
//       'The admin with given token does not exist.',
//       401,
//     );
//     next(error);
//   }
//   // check if the user changed his password after token was issued
//   const isPasswordChanged = await currentAdmin.isPasswordChanged(
//     decodedToken.iat,
//   );
//   if (isPasswordChanged) {
//     const error = new customError(
//       'The password has been change recently, Please login again',
//       401,
//     );
//     next(error);
//   }
//   // allow user access the route
//   req.user = currentAdmin;
//   next();
// });

// exports.restricted = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       const error = new customError(
//         'You do not have permission to perform this action',
//         403,
//       );
//       next(error);
//     }
//     next();
//   };
// };

// exports.forgetPassword = asyncHandler(async (req, res, next) => {
//   // get user based on email
//   const user = await admin.findOne({ email: req.body.email });

//   if (!user) {
//     next(new customError('Could not find the user with the given email', 404));
//   }
//   // generate random reset token
//   const resetToken = user.createResetPasswordToken();
//   await user.save({ validateBeforeSave: false });
//   // send email to the user with the reset token
//   const resetUrl = `${req.protocol}://${req.get(
//     'host',
//   )}/api/v1/admin/resetPassword/${resetToken}`;
//   const message = `We have received a password reset request. please use the below link to reset your password \n\n${resetUrl} \n\n This reset password link will be valid for 10 minutes`;
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Password change request received',
//       message,
//     });
//     res.status(200).json({
//       status: success,
//       message: 'password reset link send to the user email',
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetTokenExpire = undefined;
//     user.save({ validateBeforeSave: false });

//     return next(new customError(err.message, 500));
//   }
// });
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   const token = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await admin.findOne({
//     passwordResetToken: token,
//     passwordResetTokenExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(new customError('Token is invalid or has expired', 400));
//   }

//   user.password = req.body.password;
//   user.confirmPassword = req.body.confirmPassword;
//   user.passwordResetToken = undefined;
//   user.passwordResetTokenExpire = undefined;
//   user.passwordChangedAt = Date.now();

//   user.save();

//   const loginToken = signToken(user._id, res);

//   res.status(200).json({
//     status: 'success',
//     token: loginToken,
//   });
// });

// exports.logout = (req, res, next) => {
//   res.cookie('jwt', '', {
//     httpOnly: true,
//     sameSite: 'strict',
//     secure: process.env.NODE_ENV !== 'development',
//   });

//   res.status(200).json({
//     status: 'success',
//     message: 'Logout successful',
//   });
// };
