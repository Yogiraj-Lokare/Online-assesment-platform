const mongoose = require("mongoose");
const schema = mongoose.Schema({
  test_id: {
    type: String,
  },
  test_name: {
    type: String,
  },
  question: {
    type: String,
  },
  mcq: [
    {
      type: String,
    },
  ],
  answer: {
    type: Number,
  },
  marks: {
    type: Number,
  },
  image: {
    type: String,
  },
});
const Questions = new mongoose.model("Questions", schema);
module.exports = Questions;
