const mongoose = require("mongoose");

const controlSchema = new mongoose.Schema(
  {
    control: { type: String, required: true },
    risk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Risk",
    },
    testPro: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Control = mongoose.model("Control", controlSchema);

module.exports = Control;
