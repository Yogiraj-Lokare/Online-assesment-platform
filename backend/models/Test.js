const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    test_name: {
      type: String,
      unique: true,
      required: true,
    },
    test_creator: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
    },
    test_duration: {
      hour: {
        type: Number,
        required: true,
      },
      min: {
        type: Number,
        required: true,
      },
      second: {
        type: Number,
      },
    },
    test_type: {
      type: String,
      default: "Open",
    },
    start_time: {
      type: Date,
    },
    end_time: {
      type: Date,
    },
    Mode: {
      type: String,
      default: "Edit",
    },
  },
  {
    timestamps: true,
  }
);
const Test = new mongoose.model("Test", schema);
module.exports = Test;
