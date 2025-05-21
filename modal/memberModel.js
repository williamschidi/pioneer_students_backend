const mongoose = require("mongoose");
const validator = require("validator");

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "This email is already used"],
    validate: [validator.isEmail, "Pls enter a valid email."],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: [true, "This phone number has already been used"],
    validate: {
      validator: function (num) {
        return validator.isMobilePhone(num, "en-NG", { strictMode: false });
      },
      message: "Please provide a valid phone number",
    },
  },
  gender: {
    type: String,
    required: [true, "Please provide your gender "],
    enum: ["male", "female"],
  },
  maritalStatus: {
    type: String,
    required: [true, "Please provide your marital status"],
    enum: ["single", "married", "divorced"],
  },
  residence: {
    type: String,
  },
  occupation: {
    type: String,
  },
  state: {
    type: String,
    required: [true, "Please provide your state of origin"],
  },
  localGov: {
    type: String,
    required: [true, "Please provide your local government of origin"],
  },
});

module.exports = mongoose.model("Members", memberSchema);
