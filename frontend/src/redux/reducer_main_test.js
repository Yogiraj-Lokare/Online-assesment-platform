import {
  DATA_REQUEST,
  DATA_SUCCESS,
  DECREMENT_REMAIN,
  INCREMENT_REMAIN,
  ADD_USER,
  LOG_OUT,
  ALLOW,
} from "./actionTypes";
const initialState = {
  list: [
    {
      _id: 1,
      number: 1,
      question: "there is some problem",
      mcqs: ["option1", "option2", "option3", "option4"],
      marks: 0,
      image: "empty",
    },
  ],
  user_time: {
    hour: 0,
    min: 0,
    second: 0,
  },
  start_time: 1,
  end_time: 1,
  answers: [
    {
      _id: "1223",
      answer: 0,
    },
  ],
  remain: 0,
  LegalAccess: false,
  username: "",
  user_id: 1,
};
const reducer_main_test = (state = initialState, action) => {
  switch (action.type) {
    case ALLOW:
      console.log("reached here");
      return {
        ...state,
        loading: false,
        LegalAccess: false,
      };
    case ADD_USER:
      return {
        ...state,
        loggedIn: true,
        username: action.name,
        user_id: action._id,
      };
    case LOG_OUT:
      return {
        ...state,
        loggedIn: false,
        username: "",
        user_id: 0,
      };
    case DATA_REQUEST:
      return { ...state, loading: true };
    case DATA_SUCCESS:
      var df = [];
      for (var i = 0; i < action.data.list.length; i++) {
        df.push({
          _id: action.data.list[i]._id,
          answer: 0,
        });
      }
      return {
        ...state,
        loading: false,
        list: action.data.list,
        test_name: action.data.test_name,
        user_time: action.data.test_duration,
        remain: action.data.list.length,
        answers: df,
        start_time: action.data.start_time,
        LegalAccess: true,
      };
    case DECREMENT_REMAIN:
      var drrr = state.remain - 1;
      return {
        ...state,
        remain: drrr,
      };
    case INCREMENT_REMAIN:
      var drr = state.remain + 1;
      return {
        ...state,
        remain: drr,
      };
    default:
      return state;
  }
};
export default reducer_main_test;
