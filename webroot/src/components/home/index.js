import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class extends Component {
  render() {
    return (
      <div>
        <Link to="/room/1">Room 1</Link>
      </div>
    );
  }
}
