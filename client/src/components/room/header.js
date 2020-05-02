import React from "react";
import style from "./header.css";
import Users from "./users";

export default ({ text, users }) => {
  return (
    <div className={style.header}>
      {text}
      <div className={style.users}>
        <Users users={users} />
      </div>
    </div>
  );
};
