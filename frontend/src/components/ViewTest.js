import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography, TextField, Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { setTokenHeader } from "../redux/actions";
import axios from "axios";
import PropTypes from "prop-types";
export function ViewTest() {
  const [valid, setValid] = useState(true);
  if (localStorage.getItem("jwt")) {
    setTokenHeader(localStorage.getItem("jwt"));
  }
  const [testData, setTestdata] = useState({
    test_name: "demo test",
    start_time: "12/2/2021",
    end_time: "21/2/2021",
    _id: "sdsd",
    test_type: "Open",
    description: "sssss",
  });
  const [usersData, setusersData] = useState([
    {
      test_id: "asas",
      _id: 113,
      user_email: "asasas",
    },
  ]);
  const [questionList, setQuestionList] = useState([
    {
      question: "demo test",
      marks: 100,
      answer: 3,
      _id: "sadd",
      mcq: ["opt1", "opt2", "opt3", "opt4"],
    },
  ]);
  const testName = useParams();
  const DeleteUser = async (par) => {
    const DeleteData = {
      test_name: testData.test_name,
      test_id: testData._id,
      user_email: par,
    };
    const { data } = await axios.post("/testsave/deleteuser", { DeleteData });
    if (data.message) {
      fetchQuestions();
    }
  };
  const AddUser = async (e) => {
    e.preventDefault();
    const UserData = {
      test_name: testData.test_name,
      test_id: testData._id,
      user_email: e.target.email.value,
    };
    const { data } = await axios.post("/testsave/saveuser", { UserData });
    if (data.message == "success") {
      fetchQuestions();
    }
  };
  const fetchQuestions = async () => {
    const { data } = await axios.post("/testsave/quesandusers", {
      test_name: testName.id,
    });
    setQuestionList(data.QuestionsList);
    setusersData(data.AllowedUsersData);
  };
  useEffect(() => {
    const fetchTestData = async () => {
      const { data } = await axios.post("/test/view", {
        test_name: testName.id,
      });
      if (data.invalid != null) {
        setValid(false);
      } else {
        setTestdata(data);
      }
    };
    fetchTestData();
    fetchQuestions();
  }, []);
  return (
    <div className="container-fluid">
      <div
        className="card  shadow mt-5 mx-5 mb-5"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="card-body">
          {valid ? (
            <div className="py-3 px-3">
              <div className="text-center h2 text-green-50 font-bold">
                Welcome
              </div>
              <Typography
                variant="h5"
                style={{ backgroundColor: "#eee" }}
                className="mt-3 text-center rounded card-body shadow-sm"
              >
                TEST-NAME:- <strong>{testData.test_name}</strong>{" "}
              </Typography>
              <div className="d-flex mt-3">
                <Typography
                  variant="h5"
                  style={{ backgroundColor: "#eee" }}
                  className="card-body rounded shadow-sm mr-3 text-center"
                >
                  START-TIME:- <strong>{testData.start_time}</strong>
                </Typography>
                <Typography
                  variant="h5"
                  style={{ backgroundColor: "#eee" }}
                  className="card-body rounded shadow-sm ml-2 text-center"
                >
                  END-TIME:- <strong>{testData.end_time}</strong>
                </Typography>
              </div>
              <Typography
                variant="h5"
                style={{ backgroundColor: "#eee" }}
                className="mt-3 text-center rounded card-body shadow-sm"
              >
                TEST-DESCRIPTION:- <strong>{testData.description}</strong>{" "}
              </Typography>
              <Typography
                variant="h5"
                style={{ backgroundColor: "#eee" }}
                className="mt-3 text-center rounded card-body shadow-sm"
              >
                TEST-TYPE:- <strong>{testData.test_type}</strong>{" "}
              </Typography>
              {testData.test_type == "Closed" ? (
                <div
                  style={{ backgroundColor: "#eee" }}
                  className="card-body mt-3 rounded"
                >
                  Allowed Users:
                  {usersData.map((user) => {
                    return (
                      <div
                        style={{
                          justifyContent: "space-between",
                          borderLeft: "3px solid blue",
                          backgroundColor: "#ccc",
                        }}
                        key={user.user_email}
                        className="d-flex mt-2"
                      >
                        <div className="ml-3 p-2" style={{ fontSize: "1.5vw" }}>
                          {user.user_email}
                        </div>
                        <button
                          onClick={() => DeleteUser(user.user_email)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                  <div
                    style={{
                      backgroundColor: "lightpink",
                      fontSize: "1.5vw",
                    }}
                    className="card-body mt-4 rounded text-center"
                  >
                    Add new Users here
                  </div>
                  <form
                    className="justify-content-center d-flex mt-4"
                    onSubmit={(e) => AddUser(e)}
                  >
                    <TextField
                      type="email"
                      required={true}
                      name="email"
                      label="Email"
                      variant="outlined"
                    ></TextField>
                    <Button
                      type="submit"
                      style={{ outline: "none" }}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </form>
                </div>
              ) : (
                <div></div>
              )}
              <div style={{ width: "100%" }}>
                {questionList.map((ques) => {
                  return (
                    <div key={ques._id}>
                      <Editor
                        key={ques._id}
                        ques={ques}
                        fetchQuestions={fetchQuestions}
                        test_name={testData.test_name}
                        test_id={testData._id}
                      />
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  backgroundColor: "lightpink",
                  fontSize: "1.5vw",
                }}
                className="card-body mt-4 rounded text-center"
              >
                Add new Questions here
              </div>
              <Editor
                fetchQuestions={fetchQuestions}
                test_name={testData.test_name}
                test_id={testData._id}
              />
            </div>
          ) : (
            <div>Illegal access</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Editor(props) {
  const [question, setQuestion] = useState({
    val: props.ques != undefined ? props.ques.question : "",
  });
  const [answer, setAnswer] = useState({
    val: props.ques != undefined ? props.ques.answer : "",
  });
  const [marks, setMarks] = useState({
    val: props.ques != undefined ? props.ques.marks : "",
  });
  const [mcq1, setMcq1] = useState({
    val: props.ques != undefined ? props.ques.mcq[0] : "",
  });
  const [mcq2, setMcq2] = useState({
    val: props.ques != undefined ? props.ques.mcq[1] : "",
  });
  const [mcq3, setMcq3] = useState({
    val: props.ques != undefined ? props.ques.mcq[2] : "",
  });
  const [mcq4, setMcq4] = useState({
    val: props.ques != undefined ? props.ques.mcq[3] : "",
  });
  const [image, setImage] = useState({
    val: props.ques != undefined ? props.ques.image : "",
  });
  const styles = {
    display: props.ques == undefined ? "none" : "",
  };
  const DeleteQues = async () => {
    const { data } = await axios.post("/testsave/deleteques", {
      id: props.ques._id,
    });
    if (data.message == "success") {
      props.fetchQuestions();
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    const questionData = {
      test_id: props.test_id,
      test_name: props.test_name,
      question: e.target.question.value,
      mcq: [
        e.target.op1.value,
        e.target.op2.value,
        e.target.op3.value,
        e.target.op4.value,
      ],
      answer: e.target.answer.value,
      marks: e.target.score.value,
      image: e.target.image.value || "empty",
    };
    const compactData = {
      questionData: questionData,
      id: props.ques ? props.ques._id : "empty",
    };
    const { data } = await axios.post("/testsave/savequestion", compactData);
    if (data.message == "success") {
      props.fetchQuestions();
    }
  };
  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        <form
          className="card-body rounded-lg shadow-sm mt-4"
          style={{
            backgroundColor: "#eeeefe",
            border: "1px solid #ccc",
          }}
          onSubmit={(e) => submit(e)}
        >
          <div className="mb-3 d-flex justify-content-between">
            <div>
              <TextField
                variant="outlined"
                required={true}
                className=""
                name="answer"
                label="answer"
                value={answer.val}
                onChange={(e) => setAnswer({ val: e.target.value })}
              ></TextField>
            </div>
            <div>
              <button type="submit" className="btn btn-success">
                Save
              </button>
              <button
                style={styles}
                type="button"
                className="btn btn-danger ml-3"
                onClick={() => DeleteQues()}
              >
                Delete
              </button>
            </div>

            <div>
              <TextField
                variant="outlined"
                required={true}
                className=""
                name="score"
                label="score"
                value={marks.val}
                onChange={(e) => setMarks({ val: e.target.value })}
              ></TextField>
            </div>
          </div>
          <div className="mb-3">
            <textarea
              required={true}
              name="question"
              value={question.val}
              onChange={(e) => setQuestion({ val: e.target.value })}
              className="form-control rounded-sm w-100"
              placeholder="add next question here"
            ></textarea>
          </div>
          <div className="mb-3">
            <input
              value={image.val}
              name="image"
              placeholder="add image link here if required"
              onChange={(e) => setImage({ val: e.target.value })}
              className="form-control w-100 "
            ></input>
          </div>
          <div className="mb-2">
            <input
              value={mcq1.val}
              required={true}
              name="op1"
              onChange={(e) => setMcq1({ val: e.target.value })}
              className="form-control w-100 "
            ></input>
          </div>
          <div className="mb-2">
            <input
              value={mcq2.val}
              required={true}
              name="op2"
              onChange={(e) => setMcq2({ val: e.target.value })}
              className="form-control w-100 "
            ></input>
          </div>
          <div className="mb-2">
            <input
              value={mcq3.val}
              required={true}
              name="op3"
              onChange={(e) => setMcq3({ val: e.target.value })}
              className="form-control w-100 "
            ></input>
          </div>
          <div className="mb-2">
            <input
              value={mcq4.val}
              required={true}
              name="op4"
              onChange={(e) => setMcq4({ val: e.target.value })}
              className="form-control w-100 "
            ></input>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

Editor.propTypes = {
  ques: PropTypes.object,
  test_id: PropTypes.string,
  test_name: PropTypes.string,
  fetchQuestions: PropTypes.func,
};

/*
edit ? (
                    <StatelessComp key={ques._id} ques={ques} />
                    <div>welc</div>
                  ) : (
                    <div>{ques._id}</div>
                    /*<Editor
                      key={ques._id}
                      ques={ques}
                      test_name={testData.test_name}
                      test_id={testData._id}
                    />
                  );
*/
