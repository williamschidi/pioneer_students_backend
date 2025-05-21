const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Pls enter a valid email."],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 8,
    select: false,
    validate: {
      validator: function (value) {
        if (!/[A-z]/.test(value)) {
          this.invalidate("Password must contain an Uppercase letter");
          return false;
        }
        if (!/[a-z]/.test(value)) {
          this.invalidate("Password must contain a Lowercase letter");
          return false;
        }
        if (!/\d/.test(value)) {
          this.invalidate("Password must contain a Number");
          return false;
        }
        if (!/[@#%$^&*()+><.,]/.test(value)) {
          this.invalidate("password must contain a Special Character");
          return false;
        }

        return true;
      },
      message: "Password validation failed",
    },
  },

  confirm_Password: {
    type: String,
    required: [true, "Confirm password is required"],
    validator: {
      validate: function (val) {
        return val === this.password;
      },
      message: "Password and Confirm password does not match",
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpire: Date,
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirm_Password = undefined;
  next();
});

adminSchema.methods.comparePassword = async function (inputPass, dbPass) {
  return await bcrypt.compare(inputPass, dbPass);
};

const AdminData = mongoose.model("Admin", adminSchema);
module.exports = AdminData;

// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');

// const adminSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Name is required'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     validate: [validator.isEmail, `Pls enter a valid email. `],
//     lowercase: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minLength: 8,
//     select: false,
//     validate: {
//       validator: function (value) {
//         if (!/[A-Z]/.test(value)) {
//           this.invalidate('Password must contain an Uppercase letter. ');
//           return false;
//         }
//         if (!/[a-z]/.test(value)) {
//           this.invalidate('Password must contain a lowercase letter. ');
//           return false;
//         }
//         if (!/\d/.test(value)) {
//           this.invalidate('Password must contain a number. ');
//           return false;
//         }
//         if (!/[@^%$*?!.,&<>]/.test(value)) {
//           this.invalidate(
//             'Password must contain at least one special character.'
//           );
//           return false;
//         }

//         return true;
//       },

//       message: 'Password validation failed',
//     },
//   },

//   confirmPassword: {
//     type: String,
//     required: [true, 'Confirm Password is required'],
//     validate: {
//       validator: function (val) {
//         return val == this.password;
//       },
//       message: 'Password and confirm Password does not match. ',
//     },
//   },
//   passwordChangedAt: Date,

//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user',
//   },
//   passwordResetToken: {
//     type: String,
//   },
//   passwordResetTokenExpire: Date,
// });

// adminSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 12);

//   this.confirmPassword = undefined;
//   next();
// });
// adminSchema.methods.comparePassword = async function (inputPass, dbPass) {
//   return await bcrypt.compare(inputPass, dbPass);
// };

// adminSchema.methods.isPasswordChanged = async function (jwtTimeStamp) {
//   const passwordChangedTimeStamp = parseInt(
//     this.passwordChangedAt.getTime() / 1000
//   );
//   if (passwordChangedTimeStamp) {
//     console.log(passwordChangedTimeStamp, jwtTimeStamp);
//     return jwtTimeStamp < passwordChangedTimeStamp;
//   }
//   return false;
// };

// adminSchema.methods.createResetPasswordToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString('hex');
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
//   return resetToken;
// };

// const adminData = mongoose.model('AdminData', adminSchema);
// module.exports = adminData;
