import React, { useEffect } from "react";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import Room from "./room";
import Home from "./home";
import "./reset.css";
import "./app.css";

export default () => {
  const createUserId = () => {
    if (window.localStorage.getItem("userId")) {
      return;
    }

    fetch("/api/users", {method: "POST"}).then(res => {
      return res.json().then(({id}) => {
        localStorage.setItem("userId", id);
      });
    });
  }

  useEffect(createUserId, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/room/:id" component={Room} />
      </Switch>
    </Router>
  );
};
