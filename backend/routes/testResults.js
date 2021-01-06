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
const ResponseTable = require("../models/ResponseTable");
const mongoose = require("mongoose");
app.use(cors());

app.post("/results", auth, async (req, res) => {
  const testData = await Test.findOne({ test_name: req.body.test_name });
  if (testData.test_creator != req.user.email) {
    return res.json({ invalid: "error" });
  }
  var results = await Score.find({ test_name: req.body.test_name });
  results = _.sortBy(results, (e) => {
    return 1 / e.score;
  });
  res.json(results);
});

app.post("/submit", auth, async (req, res) => {
  try {
    var temp = req.body.answers;
    var responseT = [];
    temp.map((resp) => {
      var respb = {
        test_name: req.body.test_name,
        user_email: req.user.email,
        question_id: resp._id,
        response: resp.answer,
      };
      responseT.push(respb);
      //const er = new ResponseTable(respb);
      //await er.save();
    });
    await mongoose.model("ResponseTable").insertMany(responseT);
    const mainData = await mongoose.model("ResponseTable").aggregate([
      {
        $match: { test_name: req.body.test_name, user_email: req.user.email },
      },
      {
        $lookup: {
          from: "questions",
          localField: "question_id",
          foreignField: "_id",
          as: "common",
        },
      },
    ]);
    var userScore = 0,
      TotalScore = 0;
    mainData.map((test) => {
      TotalScore += test.common[0].marks;
      if (test.response == test.common[0].answer) {
        userScore += test.common[0].marks;
      }
    });
    await Score.updateOne(
      { test_name: req.body.test_name, user_email: req.user.email },
      { $set: { score: userScore, TotalScore: TotalScore, TestEnded: true } }
    );
    res.json({ userScore: userScore, TotalScore: TotalScore });
  } catch (e) {
    res.json(e);
  }
});

app.post("/delete", auth, async (req, res) => {
  try {
    const valid = await mongoose
      .model("Test")
      .findOne({ test_name: req.body.test_name });
    if (valid.test_creator != req.user.email) {
      return res.json({ message: "success" });
    }
    await mongoose
      .model("Test")
      .findOneAndDelete({ test_name: req.body.test_name });
    await mongoose.model("Score").deleteMany({ test_name: req.body.test_name });
    await mongoose
      .model("ResponseTable")
      .deleteMany({ test_name: req.body.test_name });
    await mongoose
      .model("AllowedUsers")
      .deleteMany({ test_name: req.body.test_name });
    await mongoose
      .model("Questions")
      .deleteMany({ test_name: req.body.test_name });
    res.json({ message: "success" });
  } catch (e) {
    res.json(e);
  }
});

module.exports = app;
