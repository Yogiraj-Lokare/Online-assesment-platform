const mongoose = require("mongoose");
const schema = mongoose.Schema({
  test_name: {
    type: String,
  },
  username: {
    type: String,
  },
  user_email: {
    type: String,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  TestEnded: {
    type: Boolean,
    default: false,
  },
  user_start_time: {
    type: Date,
  },
  score: {
    type: Number,
    default: 0,
  },
  TotalScore: {
    type: Number,
    default: 0,
  },
});
const Score = new mongoose.model("Score", schema);
module.exports = Score;
