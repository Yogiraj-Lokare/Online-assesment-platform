import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Header1 } from "../mainPage";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
export function EditTest() {
  const [testName, setTestname] = useState("");
  const [testDesc, settestDesc] = useState("");
  const [testdh, setTestdh] = useState(0);
  const [testdm, setTestdm] = useState(0);
  const [test_type, setTestType] = useState("Open");
  const [start_time, setStart] = useState("");
  const [end_time, setEnd] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [_id, setId] = useState("sd");
  const SetError = (error) => {
    seterrorMessage(error);
    var errorElement = document.getElementById("error");
    errorElement.style.display = "block";
  };
  const clearError = () => {
    var errorElement = document.getElementById("error");
    errorElement.style.display = "none";
  };
  const submit = async (e) => {
    e.preventDefault();
    var userData = {
      test_name: testName,
      test_creator: localStorage.getItem("email"),
      description: testDesc,
      test_duration: {
        hour: testdh,
        min: testdm,
        second: 0,
      },
      test_type: test_type,
      start_time: new Date(e.target.start_time.value),
      end_time: new Date(e.target.end_time.value),
    };
    const Data = {
      userData,
      _id,
    };
    const { data } = await axios.post("/testsave/editdata", Data);
    if (data.error != undefined) {
      SetError(data.error);
    }
    if (data.message != undefined) {
      window.confirm("data uploaded succesfully");
      window.location.reload();
    }
  };
  const test_name = useParams();
  useEffect(() => {
    const fetchdata = async () => {
      const { data } = await axios.post("/testsave/onetest", {
        test_name: test_name.id,
      });
      if (data.message == undefined) {
        setTestType(data.test_type);
        settestDesc(data.description);
        setTestdh(data.test_duration.hour);
        setTestdm(data.test_duration.min);
        setTestname(data.test_name);
        setStart(data.start_time);
        setEnd(data.end_time);
        setId(data._id);
      }
      console.log(data);
    };
    fetchdata();
  }, []);
  return (
    <React.Fragment>
      <Header1 />
      <div className="container">
        <div className="card my-5 shadow">
          <div className="card-body">
            <div className="text-center">
              <div className="h4 mb-4"> Edit Test</div>
            </div>
            <div
              id="error"
              style={{ display: "none" }}
              className="alert alert-danger alert-dismissible"
            >
              {" "}
              <button
                onClick={() => clearError()}
                className="close"
                datadismiss="alert"
                aria-label="close"
              >
                &times;
              </button>
              <strong>{errorMessage}</strong>
            </div>
            <form style={{ marginLeft: "4vw" }} onSubmit={(e) => submit(e)}>
              <div className="from-group row">
                <div className="form-group col-lg-5">
                  <TextField
                    variant="filled"
                    required={true}
                    className="form-control form-control-user mb-3"
                    value={testName}
                    name="test_name"
                    label="Test-Name"
                  ></TextField>
                </div>
                <div className="form-group col-lg-5">
                  <TextField
                    variant="filled"
                    required={true}
                    onChange={(e) => settestDesc(e.target.value)}
                    value={testDesc}
                    className="form-control form-control-user mb-3"
                    name="test_desc"
                    label="Test-Description"
                  ></TextField>
                </div>
              </div>
              <div className="form-group row">
                <div className="form-group col-lg-5">
                  <TextField
                    required={true}
                    variant="filled"
                    label="Test-Duration Hours"
                    value={testdh}
                    onChange={(e) => setTestdh(e.target.value)}
                    type="number"
                    name="hour"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className="form-group col-lg-5">
                  <TextField
                    required={true}
                    variant="filled"
                    label="Test-Duration Minutes"
                    value={testdm}
                    onChange={(e) => setTestdm(e.target.value)}
                    type="number"
                    name="min"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
              <div className="row form-group">
                <div className="form-group col-lg-5">
                  previous Time: {start_time}
                  <TextField
                    required={true}
                    className="mt-2"
                    variant="filled"
                    label="Test Start Time"
                    type="datetime-local"
                    name="start_time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className="form-group col-lg-5">
                  previous Time: {end_time}
                  <TextField
                    required={true}
                    variant="filled"
                    className="mt-2"
                    label="Test End Time"
                    type="datetime-local"
                    name="end_time"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
              <FormControl variant="filled" style={{ width: "15vw" }}>
                <InputLabel id="demo-simple-select-label">Test-Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={test_type}
                  onChange={(e) => setTestType(e.target.value)}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
              <hr></hr>
              <input
                className="btn  btn-outline-success"
                type="submit"
                name="submit"
              ></input>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
