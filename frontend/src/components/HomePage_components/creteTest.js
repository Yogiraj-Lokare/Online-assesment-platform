import React, { useState } from "react";
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
export function CreateTest() {
  const [testName, setTestname] = useState("");
  const [testDesc, settestDesc] = useState("");
  const [testdh, setTestdh] = useState(0);
  const [testdm, setTestdm] = useState(0);
  const [test_type, setTestType] = useState("Open");
  const [errorMessage, seterrorMessage] = useState("");
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
    var postData = {
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
    const { data } = await axios.post("/testsave/testdata", postData);
    if (data.error != undefined) {
      SetError(data.error);
    }
    if (data.message != undefined) {
      window.confirm("data uploaded succesfully");
      window.location.reload();
    }
  };
  return (
    <React.Fragment>
      <Header1 />
      <div className="container">
        <div className="card my-5 shadow">
          <div className="card-body">
            <div className="text-center">
              <div className="h4 mb-4"> Create Test</div>
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
                    onChange={(e) => setTestname(e.target.value)}
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
                  <TextField
                    required={true}
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
                  <TextField
                    required={true}
                    variant="filled"
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
