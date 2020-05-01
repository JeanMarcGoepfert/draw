import React, { useState, useRef, useEffect } from "react";
import style from "./nameForm.css";

export default ({ setUser, roomId }) => {
  const [name, setName] = useState("");
  const makeUser = e => {
    e.preventDefault();
    fetch(`/api/rooms/${roomId}/users`, {
      method: "POST",
      body: JSON.stringify({ name })
    }).then(res => {
      if (res.status === 200) {
        res.json().then(r => {
          setUser(r.id, name);
        });
      }
    });
  };

  return (
    <form className={style.wrapper} onSubmit={makeUser}>
      <label className={style.label}>Enter your nickname:</label>
      <input
        className={style.input}
        onChange={e => setName(e.target.value)}
        value={name}
      />
    </form>
  );
};
