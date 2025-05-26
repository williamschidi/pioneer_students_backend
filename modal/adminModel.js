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
        if (!/[A-Za-z]/.test(value)) {
          this.invalidate(
            "Password must contain an Uppercase or lowercase letter"
          );
          return false;
        }

        if (!/\d/.test(value)) {
          this.invalidate("Password must contain a Number");
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
