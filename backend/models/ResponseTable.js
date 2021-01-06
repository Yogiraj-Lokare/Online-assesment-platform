const mongoose = require("mongoose");
const schema = mongoose.Schema({
  test_name: {
    type: String,
  },
  user_email: {
    type: String,
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  response: {
    type: Number,
  },
});
const ResponseTable = new mongoose.model("ResponseTable", schema);
module.exports = ResponseTable;
