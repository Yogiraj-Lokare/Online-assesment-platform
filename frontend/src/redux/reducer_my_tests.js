import { FETCH_MY_TESTS } from "./actionTypes";

const initialState = {
  data: [
    {
      test_name: "dummy_name",
      test_start: "11",
      test_end: "22",
      key: 1,
      disabled: false,
    },
  ],
};

const reducer_my_tests = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MY_TESTS:
      return {
        data: action.data,
      };
    default:
      return state;
  }
};
export default reducer_my_tests;
