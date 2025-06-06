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
        trim: true,
      },
      value: {
        type: String,
        trim: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

stateSchema.pre("save", function (next) {
  const lgNames = this.localGovernments.map((lg) => lg.name);

  const uniqueLgNames = new Set(lgNames);

  if (uniqueLgNames.size !== lgNames.len) {
    return next(
      new Error("Local Government names must be unique within the same state!")
    );
  }
  next();
});

module.exports = mongoose.model("State", stateSchema);
