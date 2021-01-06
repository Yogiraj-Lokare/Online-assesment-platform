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
app.use(cors());
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data");
  },
  filename: function (req, file, cb) {
    cb(null, "user.xlsx");
  },
});
var upload = multer({ storage: storage }).single("file");

var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data");
  },
  filename: function (req, file, cb) {
    cb(null, "test.xlsx");
  },
});
var upload1 = multer({ storage: storage1 }).single("file");
app.post("/view", auth, async (req, res) => {
  const testData = await Test.findOne({ test_name: req.body.test_name });
  if (testData == null) {
    return res.json({ invalid: "no such test" });
  }
  if (testData.test_creator != req.user.email) {
    return res.json({ invalid: true });
  }
  return res.json(testData);
});
app.post("/results", auth, async (req, res) => {
  const testData = await Test.findOne({ test_name: req.body.test_name });
  //console.log(testData.test_creator,req.user.email);
  if (testData.test_creator != req.user.email) {
    return res.json({ invalid: true });
  }
  var totalScore = 0;
  for (var i = 0; i < testData.list.length; i++) {
    totalScore += testData.list[i].marks;
  }
  const userData = await Score.findOne({ test_name: req.body.test_name });
  var response = [];
  for (var i = 0; i < userData.users.length; i++) {
    const user = {
      key: i + 1,
      username: userData.users[i].user_name,
      email: userData.users[i].user_email,
      score: userData.users[i].user_score,
      totalScore: totalScore,
    };
    response.push(user);
  }
  if (testData.test_type == "Closed") {
    var usersData = await User.find();
    for (var i = 0; i < testData.allowed_users.length; i++) {
      if (_.findIndex(response, { email: testData.allowed_users[i] }) == -1) {
        var userName = _.result(
          _.find(usersData, {
            email: testData.allowed_users[i],
          }),
          "username"
        );
        const user = {
          key: 1,
          username: userName,
          email: testData.allowed_users[i],
          score: 0,
          totalScore: 0,
        };
        response.push(user);
      }
    }
  }
  response = _.sortBy(
    response,
    (e) => {
      return 1 / e.score;
    },
    "username"
  );
  var i = 1;
  response.map((res) => {
    res.key = i;
    i++;
  });
  res.json(response);
});
app.get("/future", auth, async (req, res) => {
  try {
    const TestData = await Test.find({ test_type: "Closed" });
    //console.log(TestData);
    const userData = await User.findOne({ email: req.user.email });
    const givenTests = userData.givenTests;
    var testList = [];
    givenTests.map((test) => {
      testList.push(test.testName);
    });
    //console.log(testList);
    var responseData = [];
    TestData.map((test) => {
      const ausers = test.allowed_users;
      for (var i = 0; i < ausers.length; i++) {
        if (ausers[i] == req.user.email) {
          var livetime = new Date();
          var test_start = `${test.start_time.date} @ ${test.start_time.time}`;
          var year = parseInt(test_start.substr(0, 4));
          var mon = parseInt(test_start.substr(5, 2));
          var day = parseInt(test_start.substr(8, 2));
          var hour = parseInt(test_start.substr(13, 2));
          var min = parseInt(test_start.substr(16, 2));
          const str1 = new Date(year, mon - 1, day, hour, min);
          var test_end = `${test.end_time.date} @ ${test.end_time.time}`;
          var year = parseInt(test_end.substr(0, 4));
          var mon = parseInt(test_end.substr(5, 2));
          var day = parseInt(test_end.substr(8, 2));
          var hour = parseInt(test_end.substr(13, 2));
          var min = parseInt(test_end.substr(16, 2));
          const str2 = new Date(year, mon - 1, day, hour, min);
          var alo = true,
            add = true;
          if (str1 < livetime) {
            alo = false;
          }
          if (testList.indexOf(test.test_name) != -1) {
            add = false;
          }
          if (str2 < livetime) {
            add = false;
          }
          const ress = {
            key: test._id,
            test_name: test.test_name,
            start_time: `${test.start_time.date} @ ${test.start_time.time}`,
            end_time: `${test.end_time.date} @ ${test.end_time.time}`,
            status: alo,
          };
          if (add) {
            responseData.push(ress);
          }
        }
      }
    });

    return res.json(responseData);
  } catch (e) {
    res.json(e);
  }
});
app.get("/given", auth, async (req, res) => {
  const data = await User.findOne({ email: req.user.email });
  const tesc = data.givenTests;
  //console.log(data,tesc);
  var namer = [];
  tesc.map((tes) => {
    namer.push(tes.testName);
  });
  const d2 = await Test.find({ test_name: { $in: namer } });
  //console.log(d2);
  var final = [];
  d2.map((test1) => {
    var totalScore = 0;
    test1.list.map((testt) => {
      totalScore += testt.marks;
    });
    const st = {
      test_name: test1.test_name,
      key: test1._id,
      test_start: `${test1.start_time.date} @ ${test1.start_time.time}`,
      test_end: `${test1.end_time.date} @ ${test1.end_time.time}`,
      score: 0,
      totalScore: totalScore,
      no: 1,
    };
    final.push(st);
  });
  for (var i = 0; i < final.length; i++) {
    //final[i].score = tesc[i].score;
    for (var j = 0; j < final.length; j++) {
      if (final[i].test_name == tesc[j].testName) {
        final[i].score = tesc[j].score;
      }
    }
    //console.log(tesc[i]);
    final[i].no = i + 1;
  }
  //console.log(final);
  res.json(final);
});

app.post("/submit", auth, async (req, res) => {
  //console.log(req.body.fill);
  var score = 0;
  const anser = await Test.find({ test_name: req.body.fill.test_name });
  var ansr = [],
    marks = [];
  //console.log(anser[0]);
  anser[0].list.map((que) => {
    ansr.push(que.answer);
    marks.push(que.marks);
  });
  for (var i = 0; i < anser[0].list.length; i++) {
    if (ansr[i] == req.body.fill.answers[i]) {
      score += marks[i];
    }
  }
  const scor = await Score.findOne({ test_name: req.body.fill.test_name });
  var copi = scor;
  var aloedf = false;
  copi.users.map((user) => {
    if (user.user_email == req.user.email && user.is_test_ended == false) {
      user.user_response = req.body.fill.answers;
      user.user_score = score;
      user.is_test_ended = true;
      aloedf = true;
    }
  });
  if (aloedf) {
    const ip = await Score.updateOne(
      { test_name: req.body.fill.test_name },
      { $set: copi }
    );
    const use = await User.find({ email: req.user.email });
    const rf = use[0].givenTests;
    const rr = {
      testName: req.body.fill.test_name,
      score,
    };
    rf.push(rr);
    const dar = {
      username: use[0].username,
      email: use[0].email,
      password: use[0].password,
      createdTests: use[0].createdTests,
      givenTests: rf,
    };
    const dc = await User.updateOne({ email: req.user.email }, { $set: dar });
  }
  const resf = {
    score: score,
    test_name: req.body.fill.test_name,
  };
  res.json(resf);
});

app.post("/delete", auth, async (req, res) => {
  const dd = await Test.findByIdAndDelete(req.body._id);
  const d1d = await Score.findOneAndDelete({ test_id: req.body._id });
  res.json({ done: 1 });
});

const checking = async (name, email) => {
  const na = await Test.find({ test_name: name });
  if (na.length == 0) {
    return 3;
  }
  const scc = await Score.findOne({ test_name: name });
  //console.log('cheking-----',scc);
  //console.log(scc.users[0]);
  var guilty = false;
  if (scc.users[0] != undefined) {
    scc.users.map((user) => {
      if (user.user_email == email) {
        if (user.is_test_ended) {
          guilty = true;
        }
      }
    });
  }
  if (guilty) {
    return 2;
  }
  if (na[0].test_type == "Closed") {
    var cb = false;
    for (var i = 0; i < na[0].allowed_users.length; i++) {
      if (na[0].allowed_users[i] == email) {
        cb = true;
        break;
      }
    }
    if (!cb) {
      return 3;
    }
  }
  const test_start = `${na[0].start_time.date} @ ${na[0].start_time.time}`;
  const test_end = `${na[0].end_time.date} @ ${na[0].end_time.time}`;
  const cc = new Date();
  var year = parseInt(test_end.substr(0, 4));
  var mon = parseInt(test_end.substr(5, 2));
  var day = parseInt(test_end.substr(8, 2));
  var hour = parseInt(test_end.substr(13, 2));
  var min = parseInt(test_end.substr(16, 2));
  const ds1 = new Date(year, mon - 1, day, hour, min);

  var year = parseInt(test_start.substr(0, 4));
  var mon = parseInt(test_start.substr(5, 2));
  var day = parseInt(test_start.substr(8, 2));
  var hour = parseInt(test_start.substr(13, 2));
  var min = parseInt(test_start.substr(16, 2));
  const ds2 = new Date(year, mon - 1, day, hour, min);
  if (ds2 > cc) {
    return 6;
  }
  if (ds1 < cc) {
    return 5;
  }
  return 1;
};

app.get("/dataaccess/:id", auth, async (req, res) => {
  var c = await checking(req.params.id, req.user.email);
  if (c != 1) {
    return res.json({ code: "error here" });
  }
  const pastdata = await Score.findOne({ test_name: req.params.id });
  const coptt = pastdata.users;
  var alloer = false;
  var isS = false,
    itsva = 1,
    addornot = true;
  coptt.map((de) => {
    if (de.user_email == req.user.email) {
      addornot = false;
      if (de.test_start_time != null) {
        isS = true;
        itsva = de.test_start_time;
      }
      if (de.is_test_ended) {
        alloer = true;
      }
    }
  });
  if (alloer) {
    return res.json({ code: "error here" });
  }
  const data = await Test.find({ test_name: req.params.id });
  var list = data[0].list;
  var list1 = [];
  for (var i = 0; i < list.length; i++) {
    list[i].answer = 0;
    list1.push({
      marks: list[i].marks,
      mcqs: list[i].mcqs,
      question: list[i].question,
      _id: list[i]._id,
      number: i + 1,
    });
  }

  const ti = new Date();
  var ttt = ti.valueOf();
  if (!addornot) {
    var ff = new Date(itsva);
    ttt = ff.valueOf();
  }
  const testuser = {
    user_name: req.user.username,
    user_id: req.user._id,
    user_email: req.user.email,
    user_score: 0,
    test_start_time: ttt,
  };
  if (addornot) {
    var su = pastdata.users;
    su.push(testuser);
    const up = {
      test_id: pastdata.test_id,
      users: su,
      test_name: pastdata.test_name,
    };
    const cc = await Score.updateOne(
      { test_name: req.params.id },
      { $set: up }
    );
  }
  //console.log(up);
  const doc = {
    test_name: data[0].test_name,
    test_duration: data[0].test_duration,
    list: list1,
    start_time: ttt,
  };

  res.json(doc);
});
app.post("/check", auth, async (req, res) => {
  try {
    var c = await checking(req.body.test_name, req.user.email);
    //console.log(req.body.test_name);
    return res.send({ error: c });
  } catch (e) {
    res.json({ error1: e });
  }
});

app.post("/search", auth, async (req, res) => {
  try {
    const na = await Test.find({ test_name: req.body.test_name });
    //console.log(na[0].test_name);
    if (na.length == 0) {
      return res.json({ error: "no such test" });
    }
    return res.json(na[0].test_name);
  } catch (e) {
    res.json({ error: e });
  }
});
app.post("/onetest", auth, async (req, res) => {
  try {
    const data = await Test.findOne({ _id: req.body.test_id });
    return res.json(data);
  } catch (e) {
    res.json(e);
  }
});
app.get("/mytests", auth, async (req, res) => {
  try {
    const data1 = await Test.find({ test_creator: req.user.email });
    var nam = [];
    data1.map((data2) => {
      var liveDate = new Date();
      var test_end_time = new Date(data2.end_time);
      var disable = false;
      if (liveDate > test_end_time) {
        disable = true;
      }
      var emp = {
        test_name: data2.test_name,
        key: data2._id,
        test_type: data2.test_type,
        test_mode: data2.Mode,
        test_start: data2.start_time.toString(),
        test_end: data2.end_time.toString(),
        disabled: disable,
      };
      nam.push(emp);
    });
    return res.status(200).json({ data: nam });
  } catch (e) {
    return res.json(e);
  }
});

/*
app.post("/allowuser", auth, (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      //console.log('error',err);
    }
    res.status(200).send(req.file);
  });
});

app.post("/testlist", auth, (req, res) => {
  upload1(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      console.log("error", err);
    }
    //console.log('reached here');
    res.status(200).send(req.file);
  });
});
app.post("/testdata", auth, async (req, res) => {
  const workbook = XLSX.readFile("./data/test.xlsx");
  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];
  var data = XLSX.utils.sheet_to_json(worksheet);
  var tests = [];
  try {
    for (var i = 0; i < data.length; i++) {
      var mcq = [],
        body1;
      mcq.push(data[i].option1);
      mcq.push(data[i].option2);
      mcq.push(data[i].option3);
      mcq.push(data[i].option4);
      body1 = {
        question: data[i].questions,
        marks: data[i].marks,
        mcqs: mcq,
        answer: data[i].answer,
      };
      tests.push(body1);
      if (
        mcq == undefined ||
        data[i].answer == undefined ||
        data[i].marks == undefined ||
        data[i].questions == undefined
      ) {
        return res.json({ error: "the question list is not well formated" });
      }
    }
  } catch (e) {
    return res.json({ error: "the question list is not well formated" });
  }
  const namee = req.body.test_name;
  const names = await Test.find({ test_name: namee });
  if (names.length !== 0) {
    return res.json({ error: "test_name is already taken" });
  }
  const testdur = {
    hour: req.body.test_d_h,
    min: req.body.test_d_m,
    second: 0,
  };
  var str = {
    date: req.body.test_start_from_date,
    time: req.body.test_start_from_time,
  };
  var sdstr = {
    date: req.body.test_end_at_date,
    time: req.body.test_end_at_time,
  };
  var allowe = [];
  if (req.body.test_type == "Closed") {
    const workbook1 = XLSX.readFile("./data/user.xlsx");
    var first_sheet_name1 = workbook1.SheetNames[0];
    var worksheet1 = workbook1.Sheets[first_sheet_name1];
    var data1 = XLSX.utils.sheet_to_json(worksheet1);
    var doc = [];
    for (var i = 0; i < data1.length; i++) {
      doc.push(data1[i].Emails);
    }
    allowe = doc;
  }
  var nam1 = req.body.test_name;
  nam1 = nam1.trim();
  const store = {
    test_name: nam1,
    test_creator: req.user.email,
    list: tests,
    test_duration: testdur,
    test_type: req.body.test_type,
    start_time: str,
    end_time: sdstr,
    allowed_users: allowe,
  };

  const rett = new Test(store);
  //console.log(rett);
  try {
    const ff = await rett.save();
    const scv = {
      test_name: req.body.test_name,
      test_id: rett._id,
    };
    var sc = new Score(scv);
    const fg = await sc.save();
    //console.log(sc,fg);
  } catch (e) {
    //console.log(e);
    return res.send({ error: e });
  }
  res.json({ success: "done" });
});
app.post("/editdata", auth, async (req, res) => {
  try {
    const oneid = await Test.findOne({ _id: req.body.test_id });
    //console.log(oneid);
    const workbook = XLSX.readFile("./data/test.xlsx");
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var data = XLSX.utils.sheet_to_json(worksheet);
    var tests = [];
    try {
      for (var i = 0; i < data.length; i++) {
        var mcq = [],
          body1;
        mcq.push(data[i].option1);
        mcq.push(data[i].option2);
        mcq.push(data[i].option3);
        mcq.push(data[i].option4);
        body1 = {
          question: data[i].questions,
          marks: data[i].marks,
          mcqs: mcq,
          answer: data[i].answer,
        };
        tests.push(body1);
        if (
          mcq == undefined ||
          data[i].answer == undefined ||
          data[i].marks == undefined ||
          data[i].questions == undefined
        ) {
          return res.json({ error: "the question list is not well formated" });
        }
      }
    } catch (e) {
      return res.json({ error: "the question list is not well formated" });
    }
    const namee = req.body.test_name;
    const names = await Test.find({ test_name: namee });
    if (names.length !== 0) {
      //console.log(names[0]._id,req.body.test_id);
      if (names[0]._id != req.body.test_id) {
        return res.json({ error: "test_name is already taken" });
      }
    }
    const testdur = {
      hour: req.body.test_d_h,
      min: req.body.test_d_m,
      second: 0,
    };
    var str = {
      date: req.body.test_start_from_date,
      time: req.body.test_start_from_time,
    };
    var sdstr = {
      date: req.body.test_end_at_date,
      time: req.body.test_end_at_time,
    };
    var allowe = [];
    if (req.body.test_type == "Closed") {
      const workbook1 = XLSX.readFile("./data/user.xlsx");
      var first_sheet_name1 = workbook1.SheetNames[0];
      var worksheet1 = workbook1.Sheets[first_sheet_name1];
      var data1 = XLSX.utils.sheet_to_json(worksheet1);
      var doc = [];
      for (var i = 0; i < data1.length; i++) {
        doc.push(data1[i].Emails);
      }
      allowe = doc;
    }
    const store = {
      test_name: req.body.test_name,
      test_creator: req.user.email,
      list: tests,
      test_duration: testdur,
      test_type: req.body.test_type,
      start_time: str,
      end_time: sdstr,
      allowed_users: allowe,
    };
    const scv = await Score.findOne({ test_id: req.body.test_id });
    const up = {
      test_id: scv.test_id,
      users: scv.users,
      test_name: req.body.test_name,
    };
    //console.log(scv,up);
    //var rett =  Test(store);
    //console.log(rett);
    try {
      var dfs = req.body.test_id;
      var idf = dfs.toString();
      //console.log(up,idf);
      const up1 = await Test.updateOne(
        { _id: req.body.test_id },
        { $set: store }
      );
      const cc = await Score.updateOne({ test_id: idf }, { $set: up });
      //console.log(cc);
    } catch (e) {
      console.log(e);
      return res.send({ error: e });
    }
    //console.log('reached heerre');
    res.json({ success: "done" });
  } catch (e) {
    return res.json({ error: "id does not exits" });
  }
});
*/
module.exports = app;
