import axios from "axios";
import {
  DATA_REQUEST,
  DATA_SUCCESS,
  DECREMENT_REMAIN,
  INCREMENT_REMAIN,
  UPDATE_TIME,
  ADD_USER,
  LOG_OUT,
  FETCH_MY_TESTS,
  ALLOW,
} from "./actionTypes";

export const decrementRemain = () => {
  return {
    type: DECREMENT_REMAIN,
  };
};
export const incrementRemain = () => {
  return {
    type: INCREMENT_REMAIN,
  };
};
export const loadData = (name) => async (dispatch) => {
  dispatch({ type: DATA_REQUEST });
  const { data } = await axios.get(`/data/dataaccess/${name}`);
  if (data.code == null) {
    dispatch({ type: DATA_SUCCESS, data });
  } else {
    dispatch({
      type: ALLOW,
    });
  }
};
export const updateTime = (update, types) => {
  return {
    type: UPDATE_TIME,
    what: types,
    how: update,
  };
};
export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}
function deleteTokenHeader() {
  delete axios.defaults.headers.common["Authorization"];
}

const logout1 = () => {
  localStorage.removeItem("jwt");
  deleteTokenHeader();
  localStorage.removeItem("username");
  localStorage.removeItem("email");
};
const logged = (data) => {
  localStorage.setItem("jwt", data.token);
  setTokenHeader(data.token);
  localStorage.setItem("username", data.user.username);
  localStorage.setItem("email", data.user.email);
};
export const signin = (body) => async (dispatch) => {
  const { data } = await axios.post("/user/signup", body);
  logged(data);
  dispatch({
    type: ADD_USER,
    id: data.user._id,
    name: data.user.username,
  });
};
export const login = (body) => async (dispatch) => {
  const { data } = await axios.post("/user/login", body);
  logged(data);
  dispatch({
    type: ADD_USER,
    id: data.user._id,
    name: data.user.username,
  });
};
export const logout = () => async (dispatch) => {
  logout1();
  dispatch({
    type: LOG_OUT,
  });
};
export const fetch = () => async (dispatch) => {
  const { data } = await axios.get("/test/mytests");
  dispatch({
    type: FETCH_MY_TESTS,
    data: data.data,
  });
};
