import React from "react";
import style from "./style.css";

export default props => {
  const id = props.match.params.id;
  return (
    <div>
      <h1>Room {id}</h1>
    </div>
  );
};
