import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer_main_test from './reducer_main_test';
import reducer_my_tests from './reducer_my_tests';
const initialState={};
const rootReducer = combineReducers({
    reducer_main_test,
    reducer_my_tests
});

const store = createStore(rootReducer,initialState,applyMiddleware(thunk));
export default store;