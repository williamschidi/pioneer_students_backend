const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  localGovernments: [
    {
      name: {
        type: String,
        unique: true,
        trim: true,
      },
      value: {
        type: String,
        unique: true,
        trim: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

module.exports = mongoose.model("State", stateSchema);
