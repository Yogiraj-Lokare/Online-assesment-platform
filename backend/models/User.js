const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const schema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.methods.generateToken = async function () {
  const user = this;
  const id = user._id;
  const token = await jwt.sign({ id }, "secretkey");
  await user.save();
  return token;
};
schema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No such email in database");

  var ism = false;
  if (user.password === password) {
    ism = true;
  }
  if (!ism) throw new Error("password did not match");
  return user;
};

const User = new mongoose.model("User", schema);
module.exports = User;
