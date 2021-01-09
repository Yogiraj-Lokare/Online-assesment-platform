import React, { useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Navbar } from "react-bootstrap";
import { LoginForm } from "./HomePage_components/loginForm";
import { RegisterForm } from "./HomePage_components/registerForm";
import { useDispatch } from "react-redux";
import { logout, setTokenHeader } from "../redux/actions";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Snackbar } from "@material-ui/core";
import axios from "axios";
import logo from "../Assets/testit1.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginRight: "1vw",
    color: "white",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export function Header1() {
  const name = localStorage.getItem("username");
  const classes = useStyles();
  var loggedIn = false;
  if (name != null) {
    loggedIn = true;
  }
  if (localStorage.getItem("jwt")) {
    setTokenHeader(localStorage.getItem("jwt"));
  }
  const dispatch = useDispatch();
  /*const [value,setvalue] = useState('');
    const [message,setmessage] = useState('');*/
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setShow(false);
  const [option, setOption] = useState(1);
  const opt1 = () => {
    setOption(1);
  };
  const opt2 = () => {
    setOption(2);
  };
  const handleShow = () => setShow(true);
  const history = useHistory();
  const submitHandler = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("/test/search", {
      test_name: e.target.testname.value,
    });
    console.log(data);
    if (data.error != null) {
      setOpen(true);
    } else {
      history.push(`/middle/${data}`);
    }
  };
  const loggout = () => {
    dispatch(logout());
    history.push("/");
  };
  return (
    <div className="maiin">
      {loggedIn ? (
        <nav className="navbar bg-dark navbar-expand-lg shadow sticky-top mb-4 navbar-dark ">
          <a className="navbar-brand" href="#">
            {name}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#
               navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse ml-md-3"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink to="/giventests" className="nav-link">
                  GIVEN-TESTS
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/mytests" className="nav-link">
                  CONDUCTED-TESTS
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/create" className="nav-link">
                  CREATE-TEST
                </NavLink>
              </li>
            </ul>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <form
                action="#"
                onSubmit={(e) => {
                  submitHandler(e);
                }}
              >
                <InputBase
                  placeholder="Search Test…"
                  type="text"
                  name="testname"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </form>
            </div>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={open}
              onClose={() => setOpen(false)}
              autoHideDuration={3000}
              message="This test is not available"
              key="wel"
            />
            <button
              onClick={() => loggout()}
              style={{ outline: "none" }}
              className="px-3  rounded-full text-lg py-1 border-2 text-white hover:border-4 hover:border-red-200 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>
      ) : (
        <React.Fragment>
          <Navbar
            expand="lg"
            variant="light"
            bg="white"
            className=" shadow static-top flex-row justify-content-between mb-4"
          >
            <a href="#">
              <img
                style={{ maxHeight: "40px", width: "100%" }}
                src={logo}
              ></img>
            </a>
            <Button variant="primary" onClick={handleShow} className="">
              Sign-In
            </Button>
          </Navbar>
        </React.Fragment>
      )}

      <Modal show={show} onHide={handleClose} className="">
        <Modal.Header closeButton>
          <Modal.Title>Sign_In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-between">
              <Button className="w-100 ml-0 rounded-0 " onClick={() => opt1()}>
                Login
              </Button>
              <Button className="w-100 rounded-0 " onClick={() => opt2()}>
                Register
              </Button>
            </div>
            <div>{option == 1 ? <LoginForm /> : <RegisterForm />}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
