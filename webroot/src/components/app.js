import React from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import Room from "./room";
import Home from "./home";
import "./reset.css";
import "./app.css";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/room/:id" component={Room} />
      </Switch>
    </Router>
  );
};
