const mongoose = require("mongoose");
const validator = require("validator");

const riskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    impact: {
      type: Number,
      default: 0,
    },
    probability: {
      type: Number,
      default: 0,
    },
    subStream: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubStream",
    },
  },
  {
    timestamps: true,
  }
);

const Risk = mongoose.model("Risk", riskSchema);

module.exports = Risk;
