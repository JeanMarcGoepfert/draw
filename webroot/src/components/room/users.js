import React, { useState, useRef, useEffect } from "react";
import style from "./users.css";

export default props => {
  return (
    <div>
      {Object.values(props.users || {}).map((v, i) => {
        return (
          <div key={i} className={style.user}>
            {v.name}
          </div>
        );
      })}
    </div>
  );
};
