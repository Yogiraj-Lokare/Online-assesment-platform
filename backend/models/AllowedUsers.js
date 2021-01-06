const mongoose = require("mongoose");
const schema = mongoose.Schema({
  test_id: {
    type: String,
  },
  test_name: {
    type: String,
  },
  user_email: {
    type: String,
  },
});
const AllowedUsers = new mongoose.model("AllowedUsers", schema);
module.exports = AllowedUsers;
