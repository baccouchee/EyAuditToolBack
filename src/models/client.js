const mongoose = require("mongoose");
const validator = require("validator");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    priority: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: { type: Date, default: Date.now },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
