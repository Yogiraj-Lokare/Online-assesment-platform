const express = require("express");
const auth = require("../middleware/auth");
const app = express.Router();
const multer = require("multer");
const cors = require("cors");
const XLSX = require("xlsx");
const _ = require("lodash");
const Test = require("../models/Test");
const User = require("../models/User");
const Score = require("../models/Score");
const Questions = require("../models/Questions");
const AllowedUsers = require("../models/AllowedUsers");
const mongoose = require("mongoose");
app.use(cors());

const setMode = async (test_name, mode) => {
  await Test.updateOne({ test_name: test_name }, { $set: { Mode: mode } });
};

app.post("/editdata", auth, async (req, res) => {
  const finalData = req.body.userData;
  const id = req.body._id;
  await mongoose.model("Test").updateOne({ _id: id }, { $set: finalData });
  res.json({ message: "success" });
});
app.post("/onetest", auth, async (req, res) => {
  var testD = await mongoose
    .model("Test")
    .findOne({ test_name: req.body.test_name });
  if (req.user.email != testD.test_creator) {
    return res.json({ message: "error" });
  }
  const finalData = {
    description: testD.description,
    test_name: testD.test_name,
    test_duration: testD.test_duration,
    test_type: testD.test_type,
    _id: testD._id,
    start_time: testD.start_time.toString().substr(0, 25),
    end_time: testD.end_time.toString().substr(0, 25),
  };
  return res.json(finalData);
});
app.post("/testdata", auth, async (req, res) => {
  const match = await Test.find({ test_name: req.body.test_name });
  if (match.length != 0) {
    return res.json({ error: "test name already taken" });
  }
  const uploadTestData = new Test(req.body);
  await uploadTestData.save();
  res.json({ message: "success" });
});
app.post("/quesandusers", auth, async (req, res) => {
  try {
    const Testdata = await Test.findOne({ test_name: req.body.test_name });
    if (Testdata.test_creator != req.user.email) {
      return res.json({ message: "invalid access" });
    }
    const QuestionsList = await Questions.find({
      test_name: req.body.test_name,
    });
    const AllowedUsersData = await AllowedUsers.find({
      test_name: req.body.test_name,
    });
    return res.json({ QuestionsList, AllowedUsersData });
  } catch (e) {
    return res.json(e);
  }
});
app.post("/savequestion", auth, async (req, res) => {
  try {
    if (req.body.id == "empty") {
      const questionData = new Questions(req.body.questionData);
      await questionData.save();
    } else {
      await Questions.updateOne(
        { _id: req.body.id },
        { $set: req.body.questionData }
      );
    }
    setMode(req.body.questionData.test_name, "Edit");
    res.json({ message: "success" });
  } catch (e) {
    return res.json(e);
  }
});
app.post("/deleteques", auth, async (req, res) => {
  try {
    await Questions.findByIdAndDelete({ _id: req.body.id });
    res.json({ message: "success" });
  } catch (e) {
    return res.json(e);
  }
});
app.post("/saveuser", auth, async (req, res) => {
  try {
    const usersData = new AllowedUsers(req.body.UserData);
    await usersData.save();
    setMode(req.body.UserData.test_name, "Edit");
    res.json({ message: "success" });
  } catch (e) {
    return res.json(e);
  }
});

app.post("/deleteuser", auth, async (req, res) => {
  try {
    await AllowedUsers.findOneAndDelete({
      test_name: req.body.DeleteData.test_name,
      user_email: req.body.DeleteData.user_email,
    });
    setMode(req.body.DeleteData.test_name, "Edit");
    res.json({ message: "success" });
  } catch (e) {
    return res.json(e);
  }
});

app.post("/settestmode", auth, async (req, res) => {
  try {
    setMode(req.body.test_name, req.body.mode);
    res.json({ message: "success" });
  } catch (e) {
    return res.json(e);
  }
});
module.exports = app;
