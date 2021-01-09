import React from "react";
import "../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import background from "../../Assets/background.jpg";
import { Header1 } from "../mainPage";

export default function HomePage() {
  return (
    <div className="maiin">
      <Header1 />
      <div className="container-fluid" id="home_cover">
        <img
          src={background}
          className="img-responsive"
          id="home_cover_img"
          width="100%;"
        ></img>
        <div className="container-md" id="txt_home_cover">
          <h3>Your One Stop Destination</h3>
          <br />
          <h4>for</h4>
          <br />
          <h1>VIRTUAL EXAMS</h1>
        </div>
      </div>
    </div>
  );
}
