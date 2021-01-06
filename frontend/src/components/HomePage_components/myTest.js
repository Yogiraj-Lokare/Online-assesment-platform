import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetch } from "../../redux/actions";
import { useHistory, Link } from "react-router-dom";
import { Header1 } from "../mainPage";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton, Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
export function MyTest() {
  const { data } = useSelector((state) => state.reducer_my_tests);
  const [results, setResults] = useState([
    {
      _id: 1,
      username: "2",
      user_email: "22",
      score: 1,
      TotalScore: 10,
    },
  ]);
  const [titleData, setTitleData] = useState({
    test_name: "name",
    test_start: "1",
    test_end: "12",
  });
  const [valid, setValid] = useState(true);
  const TestMode = async (test) => {
    const { data } = await axios.post("/testsave/settestmode", {
      test_name: test.test_name,
      mode: "Active",
    });
    if (data.message) {
      dispatch(fetch());
    }
  };
  const hideResults = () => {
    const page = document.getElementById("page");
    page.classList.remove("show-results");
    page.classList.add("hide-results");
    const mainpage = document.getElementById("main");
    mainpage.classList.remove("hide-results");
    mainpage.classList.add("show-results");
  };
  const result = async (par) => {
    const { data } = await axios.post("/result/results", {
      test_name: par.test_name,
    });
    if (data.invalid != null) {
      setValid(false);
    } else {
      setResults(data);
      setTitleData({
        test_name: par.test_name,
        test_start: par.test_start,
        test_end: par.test_end,
      });
    }
    const page = document.getElementById("page");
    page.classList.remove("hide-results");
    page.classList.add("show-results");
    const mainpage = document.getElementById("main");
    mainpage.classList.remove("show-results");
    mainpage.classList.add("hide-results");
  };
  const check = () => {
    if (data[0] == undefined) {
      return true;
    }
    if (data[0].test_name == "dummy_name") {
      return false;
    }
    return true;
  };
  const del = async (par) => {
    await axios.post("/result/delete", { test_name: par.test_name });
    window.confirm("Test deleted successfully");
    window.location.reload();
  };
  const dispatch = useDispatch();
  const history = useHistory();
  const redirect = (par) => {
    history.push(`/edittest/${par.test_name}`);
  };
  useEffect(() => {
    if (!check()) {
      dispatch(fetch());
    }
  }, []);
  return (
    <React.Fragment>
      <Header1 />
      <div className="mx-4">
        <div className="w-100 card my-5 shadow">
          <div className="card-body">
            <div id="main">
              <div className="text-center">
                <div className="h4 mb-4">Your tests</div>
              </div>
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      Test-Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      Test-Type
                    </th>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      Test-Mode
                    </th>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      Start_time
                    </th>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      End_time
                    </th>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      Edit
                    </th>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      Delete
                    </th>
                    <th
                      style={{
                        backgroundColor: "rgba(111, 7, 247, 0.445)",
                        color: "white",
                      }}
                      scope="col"
                    >
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((ts) => {
                    return (
                      <tr key={ts.key}>
                        <td>
                          <Link to={`/view/${ts.test_name}`}>
                            {ts.test_name}
                          </Link>
                        </td>
                        <td className="text-purple-600">{ts.test_type}</td>
                        <td>
                          {ts.test_mode == "Edit" ? (
                            <div>
                              <button
                                onClick={() => TestMode(ts)}
                                className="btn btn-primary"
                              >
                                Activate test
                              </button>
                            </div>
                          ) : (
                            <div>Active</div>
                          )}
                        </td>
                        <td>{ts.test_start.substr(0, 25)}</td>
                        <td>{ts.test_end.substr(0, 25)}</td>
                        <td>
                          <IconButton
                            disabled={ts.disabled}
                            aria-label="edit"
                            onClick={() => redirect(ts)}
                            style={{ outline: "none" }}
                          >
                            <EditIcon />
                          </IconButton>
                        </td>
                        <td>
                          {" "}
                          <IconButton
                            onClick={() => del(ts)}
                            style={{ outline: "none" }}
                            color="secondary"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </td>
                        <td>
                          <button
                            onClick={() => result(ts)}
                            className="btn btn-success"
                          >
                            Results
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div id="second">
              <div className="hide-results" id="page">
                <Button
                  color="primary"
                  onClick={() => hideResults()}
                  style={{ outline: "none" }}
                >
                  back
                </Button>
                {valid ? (
                  <div>
                    <Typography variant="h3" color="primary">
                      <div style={{ textAlign: "center" }}>
                        {titleData.test_name}
                      </div>
                    </Typography>
                    <Typography style={{ textAlign: "center" }} variant="h5">
                      start-time : {titleData.test_start}
                      <br />
                      end-time : {titleData.test_end}
                    </Typography>
                    <table className="table table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th
                            style={{ backgroundColor: "#ccc", color: "white" }}
                            scope="col"
                          >
                            User-name
                          </th>
                          <th
                            style={{ backgroundColor: "#ccc", color: "white" }}
                            scope="col"
                          >
                            Email-Id
                          </th>
                          <th
                            style={{ backgroundColor: "#ccc", color: "white" }}
                            scope="col"
                          >
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((ts) => {
                          return (
                            <tr key={ts._id}>
                              <td>
                                {ts.username == undefined ? (
                                  <div
                                    style={{ fontSize: "100%" }}
                                    className="badge badge-warning"
                                  >
                                    User Not registerd
                                  </div>
                                ) : (
                                  <div>{ts.username}</div>
                                )}
                              </td>
                              <td>{ts.user_email}</td>
                              <td align="right">
                                {ts.score}/{ts.TotalScore}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>Illegal access</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
