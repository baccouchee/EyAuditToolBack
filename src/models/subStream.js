const mongoose = require("mongoose");
const validator = require("validator");

const subStreamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    workprogram: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkProgram",
    },
  },
  {
    timestamps: true,
  }
);

const SubStream = mongoose.model("SubStream", subStreamSchema);

module.exports = SubStream;
