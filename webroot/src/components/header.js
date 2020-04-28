import React from "react";
import style from "./header.css";

export default ({ text }) => {
  return <div className={style.header}>{text}</div>;
};
