import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Route, HashRouter } from "react-router-dom";
import Result from "./components/Result";
import HomePage from "./components/HomePage_components/HomePage";
import { MiddlePage } from "./components/middlepage";
import store from "./redux/store";
import { Provider } from "react-redux";
import { MainPart } from "./components/HomePage_components/mainPart";
import { GivenTest } from "./components/HomePage_components/givenTest";
import { CreateTest } from "./components/HomePage_components/creteTest";
import { EditTest } from "./components/HomePage_components/EditTest";
import { MyTest } from "./components/HomePage_components/myTest";
import { ViewTest } from "./components/ViewTest";
import Video from "./components/Video";
import Testing from "./components/Testing";
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <React.StrictMode>
        <div>
          <Route path="/middle/:id" exact={true} component={MiddlePage} />
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/test/:id" exact={true} component={App} />
          <Route path="/submit/:testname/:s1/:s2" component={Result} />
          <Route path="/mytests" component={MyTest} />
          <Route path="/testcode" exact={true} component={MainPart} />
          <Route path="/giventests" component={GivenTest} />
          <Route path="/create" component={CreateTest} />
          <Route path="/edittest/:id" component={EditTest} />
          <Route path="/view/:id" component={ViewTest} />
          <Route path="/video" component={Video}></Route>
          <Route path="/testing" component={Testing}></Route>
        </div>
      </React.StrictMode>
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
