import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
function Video() {
  const start = () => {
    var pre = document.getElementById("video");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        pre.srcObject = stream;
      });
  };
  const end = () => {
    var pre = document.getElementById("video");
    pre.srcObject.getTracks().forEach((track) => track.stop());
  };
  return (
    <React.Fragment>
      <video
        id="video"
        autoPlay
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "250px",
          height: "150px",
        }}
      ></video>
      <div className="container">
        <div className="card my-5 shadow ">
          <div className="card-body ">
            <div className="text-center">video preview</div>
            <button onClick={() => start()} className="btn btn-primary mb-5">
              {" "}
              start
            </button>
            <button onClick={() => end()} className="btn btn-primary">
              {" "}
              stop
            </button>
            <br />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default Video;
