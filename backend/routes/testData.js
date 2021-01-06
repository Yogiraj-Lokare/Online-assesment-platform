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
app.use(cors());

const checking = async (test_name, email) => {
  const testData = await Test.findOne({ test_name: test_name, Mode: "Active" });
  if (testData.length == 0) {
    return 3;
  }
  if (testData.test_type == "Closed") {
    const AllowList = await AllowedUsers.find({
      test_name: test_name,
      user_email: email,
    });

    if (AllowList.length == 0) {
      return 3;
    }
  }
  const ScoreData = await Score.find({
    test_name: test_name,
    user_email: email,
    TestEnded: true,
  });
  if (ScoreData.length != 0) {
    return 2;
  }
  const liveTime = new Date();
  const Start = new Date(testData.start_time);
  const End = new Date(testData.end_time);
  if (liveTime > End) {
    return 5;
  }
  if (liveTime < Start) {
    return 6;
  }
  return 1;
};

app.get("/given", auth, async (req, res) => {
  try {
    const UserData = await Score.find({
      user_email: req.user.email,
      TestEnded: true,
    });
    return res.json(UserData);
  } catch (e) {
    return res.json(e);
  }
});
app.get("/future", auth, async (req, res) => {
  try {
    const AllowedUserTests = await AllowedUsers.find({
      user_email: req.user.email,
    });
    const UserData = await Score.find({
      user_email: req.user.email,
      TestEnded: true,
    });
    var TestList = [],
      givenTestList = [];
    AllowedUserTests.map((test) => {
      TestList.push(test.test_name);
    });
    UserData.map((test) => {
      givenTestList.push(test.test_name);
    });
    const testData = await Test.find({
      test_name: { $in: TestList, $nin: givenTestList },
      Mode: "Active",
    });
    var finalTestData = [];
    testData.map((test) => {
      const liveTime = new Date();
      const Start = new Date(test.start_time);
      const End = new Date(test.end_time);
      var toAdd = undefined;
      if (liveTime < Start) {
        toAdd = true;
      } else if (liveTime < End) {
        toAdd = false;
      }
      if (toAdd != undefined) {
        const testToAdd = {
          test_name: test.test_name,
          start_time: test.start_time,
          end_time: test.end_time,
          status: toAdd,
          _id: test._id,
        };
        finalTestData.push(testToAdd);
      }
    });
    res.json(finalTestData);
  } catch (e) {
    return res.json(e);
  }
});

app.post("/check", auth, async (req, res) => {
  try {
    var response = await checking(req.body.test_name, req.user.email);
    res.json({ error: response });
  } catch (e) {
    return res.json(e);
  }
});
app.get("/dataaccess/:id", auth, async (req, res) => {
  try {
    var checked = await checking(req.params.id, req.user.email);
    if (checked != 1) {
      return res.json({ code: "error" });
    }
    const testData = await Test.findOne({ test_name: req.params.id });
    const questionsList = await Questions.find({ test_name: req.params.id });
    //console.log(testData, questionsList);
    var finalQuestionList = [];
    for (var i = 0; i < questionsList.length; i++) {
      const question = {
        marks: questionsList[i].marks,
        mcqs: questionsList[i].mcq,
        question: questionsList[i].question,
        _id: questionsList[i]._id,
        number: i + 1,
        image: questionsList[i].image,
      };
      finalQuestionList.push(question);
    }
    //console.log(finalQuestionList);
    const ScoreList = await Score.findOne({
      test_name: req.params.id,
      user_email: req.user.email,
    });
    var start_time = new Date();
    if (ScoreList == null) {
      const livetime = new Date();
      const ScoreData = {
        test_name: testData.test_name,
        username: req.user.username,
        user_email: req.user.email,
        start_time: testData.start_time,
        end_time: testData.end_time,
        user_start_time: livetime,
      };
      const UploadData = new Score(ScoreData);
      //console.log(ScoreData);
      await UploadData.save();
    } else {
      if (ScoreList.TestEnded == true) {
        return res.json({ code: "error" });
      }
      start_time = new Date(ScoreList.user_start_time);
    }
    const finalData = {
      test_name: testData.test_name,
      test_duration: testData.test_duration,
      list: finalQuestionList,
      start_time: start_time,
    };
    //console.log(finalData);
    res.json(finalData);
  } catch (e) {
    return res.json(e);
  }
});

module.exports = app;
