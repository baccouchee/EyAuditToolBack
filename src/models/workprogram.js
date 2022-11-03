const mongoose = require("mongoose");
const validator = require("validator");

const workProgramSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      //   required: true,
      ref: "Project",
    },
    name: {
      type: String,
      required: true,
    },
    senior: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    junior: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    priority: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WorkProgram = mongoose.model("WorkProgram", workProgramSchema);

module.exports = WorkProgram;
