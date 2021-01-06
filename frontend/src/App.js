import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Question from "./components/Question";
import Footer from "./components/Footer";
import { connect, useSelector } from "react-redux";
import { loadData, setTokenHeader } from "./redux/actions";
import { useParams } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import propTypes from "prop-types";
function App(props) {
  const [select, setSelect] = useState(1);
  const handle = useFullScreenHandle();
  const Modify = (value) => {
    setSelect(value);
  };

  if (localStorage.getItem("jwt")) {
    setTokenHeader(localStorage.getItem("jwt"));
  }
  const testName = useParams();
  const { loading, LegalAccess } = useSelector(
    (state) => state.reducer_main_test
  );
  useEffect(() => {
    props.loadData(testName.id);
  }, []);
  const selectedQuestionStyle = {
    backgroundColor: "rgb(20, 98, 243)",
    color: "white",
  };
  const answerdQuestionStyle = {
    backgroundColor: "rgb(5, 146, 36)",
    color: "white",
  };
  return loading ? (
    <div>Loading...</div>
  ) : !LegalAccess ? (
    <div>Illegal Access</div>
  ) : (
    <React.Fragment>
      <FullScreen handle={handle}>
        <div className="container1">
          <Navbar handle={handle} />
          {!handle.active ? (
            <div className="flex flex-col justify-center items-center">
              <div className="h1">To start test open it in fullscreen</div>
              <button className="btn btn-primary" onClick={handle.enter}>
                Start
              </button>
            </div>
          ) : (
            <span>
              <div className="main">
                <div className="list">
                  {props.list.map((Question) => {
                    var tooltip = `question no. ${Question.number}`;
                    if (Question.number == select) {
                      return (
                        <button
                          style={selectedQuestionStyle}
                          data-toggle="tooltip"
                          title={tooltip}
                          id={Question._id}
                          onClick={() => Modify(Question.number)}
                          key={Question._id}
                          className="qbtn"
                        >
                          {Question.number}
                        </button>
                      );
                    }
                    if (props.answers[Question.number - 1].answer != 0) {
                      return (
                        <button
                          data-toggle="tooltip"
                          title={tooltip}
                          style={answerdQuestionStyle}
                          id={Question._id}
                          onClick={() => Modify(Question.number)}
                          key={Question._id}
                          className="qbtn"
                        >
                          {Question.number}
                        </button>
                      );
                    }
                    return (
                      <button
                        data-toggle="tooltip"
                        title={tooltip}
                        id={Question._id}
                        onClick={() => Modify(Question.number)}
                        key={Question._id}
                        className="qbtn"
                      >
                        {Question.number}
                      </button>
                    );
                  })}
                </div>
                <Question select={select} Next={Modify} />
              </div>
              <Footer />
            </span>
          )}
        </div>
      </FullScreen>
    </React.Fragment>
  );
}
App.propTypes = {
  answers: propTypes.array,
  list: propTypes.array,
  loadData: propTypes.func,
};
const mapStateToProps = (state) => {
  return {
    list: state.reducer_main_test.list,
    answers: state.reducer_main_test.answers,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadData: (name) => {
      dispatch(loadData(name));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
