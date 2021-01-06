import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Header1 } from "../mainPage";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
export function MainPart() {
  const [ser, setser] = useState("");
  const [message, setmsg] = useState("");
  const history = useHistory();
  const clear = () => {
    var er = document.getElementById("error");
    er.style.display = "none";
  };
  const SetError = (error) => {
    setmsg(error);
    var er = document.getElementById("error");
    er.style.display = "block";
  };
  const submitHandler = async () => {
    const { data } = await axios.post("/test/search", { test_name: ser });
    console.log(data);
    if (data.error != null) {
      SetError(data.error);
    } else {
      history.push(`/middle/${data}`);
    }
  };
  return (
    <React.Fragment>
      <Header1 />
      <div className="container">
        <div className="card my-5 shadow ">
          <div className="card-body">
            <div className="text-center">
              <Typography variant="h3"> Search</Typography>
            </div>
            <div
              id="error"
              style={{ display: "none" }}
              className="alert alert-danger alert-dismissible"
            >
              {" "}
              <button
                onClick={() => clear()}
                className="close"
                datadismiss="alert"
                aria-label="close"
              >
                &times;
              </button>
              <strong>{message}</strong>
            </div>
            <Paper
              elevation={0}
              style={{ marginTop: "1vw", backgroundColor: "transparent" }}
            >
              <Grid
                container
                spacing={1}
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <TextField
                    name="test_name"
                    value={ser}
                    onChange={(e) => setser(e.target.value)}
                    variant="outlined"
                    placeholder="Search..."
                  ></TextField>
                </Grid>
                <Grid item>
                  <Button
                    style={{
                      backgroundColor: "rgb(77, 89, 255)",
                      color: "white",
                      fontSize: "1.5vw",
                      outline: "none",
                    }}
                    onClick={() => submitHandler()}
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Go
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
