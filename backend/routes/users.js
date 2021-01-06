const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const app = express.Router();

app.post("/signup", async (req, res, next) => {
  var bm = {
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  var user = new User(bm);
  try {
    user = await user.save();
  } catch (e) {
    res.send(e);
  }
  try {
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.sendStatus(501);
  }
});
app.post("/login", async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = app;
