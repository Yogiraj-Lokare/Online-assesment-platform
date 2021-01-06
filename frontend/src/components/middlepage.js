import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { setTokenHeader } from "../redux/actions";
import PropTypes from "prop-types";
export function MiddlePage() {
  if (localStorage.getItem("jwt")) {
    setTokenHeader(localStorage.getItem("jwt"));
  }
  const d = useParams();
  const [sel, setsel] = useState(4);
  const ups = () => {
    switch (sel) {
      case 1:
        return <Wel test_name={d.id} />;
      case 2:
        return <Al />;
      case 3:
        return <Na />;
      case 4:
        return <Loader />;
      case 5:
        return <End />;
      case 6:
        return <NotS />;
      default:
        return <Na />;
    }
  };
  useEffect(() => {
    const sd = async () => {
      const { data } = await axios.post("/data/check", { test_name: d.id });
      console.log(data);
      if (data.error != null) {
        if (data.error == "2") {
          setsel(2);
        }
        if (data.error == "3") {
          setsel(3);
        }
        if (data.error == "5") {
          setsel(5);
        }
        if (data.error == "6") {
          setsel(6);
        }
        if (data.error == "1") {
          setsel(1);
        }
      }
    };
    sd();
  }, []);
  return (
    <div className="container">
      <div className="card my-5 shadow">
        <div className="card-body">{ups()}</div>
      </div>
    </div>
  );
}
function Al() {
  return <div className="h2 text-center">You already gave this test</div>;
}
function Na() {
  return <div>You are not invited to this test</div>;
}
function Wel(props) {
  const history = useHistory();
  const start = () => {
    history.push(`/test/${props.test_name}`);
  };
  return (
    <React.Fragment>
      <div className="text-center">welcome</div>
      <div>test duration is 2 hours</div>
      <span>don&apos;t change tabs</span>
      <br />
      <hr />
      <button className="btn btn-outline-primary" onClick={() => start()}>
        Start
      </button>
    </React.Fragment>
  );
}
Wel.propTypes = {
  test_name: PropTypes.string,
};
function Loader() {
  return <div>Loading...</div>;
}
function End() {
  return <div>test ended</div>;
}
function NotS() {
  return <div>test is not started</div>;
}
/**{sel>=2 ? (sel==2 ? (<Al/>):(<Na/>) ):(<Wel/>)} */
