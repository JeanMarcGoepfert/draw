import React from "react";
import style from "./index.css";

export default props => {
  const createRoom = () => {
    fetch(`/api/rooms`, { method: "POST" }).then(res => {
      if (res.status === 200) {
        res.json().then(room => {
          props.history.push(`/room/${room.id}`);
        });
      }
    });
  };

  return (
    <div className={style.wrapper}>
      <button onClick={createRoom} className={style.button}>
        Create a new room
      </button>
    </div>
  );
};
