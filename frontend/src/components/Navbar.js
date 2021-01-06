import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { updateTime } from "../redux/actions";
import axios from "axios";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PropTypes from "prop-types";
function Navbar(props) {
  const history = useHistory();
  const { answers, test_name } = useSelector(
    (state) => state.reducer_main_test
  );
  const endTest = async () => {
    const { data } = await axios.post("/result/submit", {
      answers: answers,
      test_name: test_name,
    });
    console.log(data);
    history.push(`/submit/${test_name}/${data.userScore}/${data.TotalScore}`);
  };
  const { start_time } = useSelector((state) => state.reducer_main_test);
  const [hour, seth] = useState(0);
  const [min, setm] = useState(0);
  const [sec, sets] = useState(0);
  //const [init, setinit] = useState(false);
  useEffect(() => {
    /*if (props.handle.active == true) {
      setinit(true);
    }
    if (props.handle.active === false && init === true) {
      endTest();
    }*/
    var inter = setInterval(() => {
      const d = new Date();
      var dcsv = new Date(start_time);
      dcsv = dcsv.valueOf();
      const vv = dcsv + props.hour * 3600000 + props.min * 60000 + 2000;
      const dd = new Date(vv);
      const dfg = d.valueOf();
      const cv = dd.valueOf();
      var dcv = (cv - dfg) / 1000;
      var h1 = 0,
        m1 = 0,
        s1 = 0;
      h1 = Math.floor(dcv / 3600);
      m1 = Math.floor(dcv / 60 - h1 * 60);
      s1 = Math.floor(dcv - h1 * 3600 - m1 * 60);
      seth(() => h1);
      setm(() => m1);
      sets(() => s1);
      if (hour <= -1) {
        endTest();
      }
    }, 1000);
    return () => clearInterval(inter);
  }, [sec]);
  /*useEffect(() => {
    const listner = async () => {
      endTest();
    };
    window.addEventListener("blur", listner);
    return () => {
      window.removeEventListener("blur", listner);
    };
  }, []);*/
  const total = props.list.length;
  var progress = (100 * props.remain) / total;
  var radius = 33;
  var stroke = 4;
  var normalizedRadius = radius - stroke * 2;
  var circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = -circumference + (progress / 100) * circumference;
  return (
    <React.Fragment>
      <div className="header">
        <div className="test-name">
          <AssignmentIcon style={{ marginRight: "1vw", fontSize: "1.6em" }} />
          {props.test_name}
        </div>
        <div className="timer">
          <div>
            {hour < 10 ? `0${hour}` : hour}:{min < 10 ? `0${min}` : min}:
            {sec < 10 ? `0${sec}` : sec}
          </div>
        </div>
        <div className="flex">
          <div className="remain flex items-center">
            <div
              className="counter-no"
              data-toggle="tooltip"
              title="Remaing Questions"
            >
              {props.remain}
            </div>
            <svg className="svgg" height={radius * 2} width={radius * 2}>
              <circle
                stroke="#fe3"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
          </div>
          <button className="end" onClick={() => endTest()}>
            END TEST
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

Navbar.propTypes = {
  remain: PropTypes.number,
  test_name: PropTypes.string,
  list: PropTypes.array,
  hour: PropTypes.number,
  min: PropTypes.number,
  handle: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    remain: state.reducer_main_test.remain,
    list: state.reducer_main_test.list,
    test_name: state.reducer_main_test.test_name,
    hour: state.reducer_main_test.user_time.hour,
    min: state.reducer_main_test.user_time.min,
    second: state.reducer_main_test.user_time.second,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateTime: (p1, p2) => dispatch(updateTime(p1, p2)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
