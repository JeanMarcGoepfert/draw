import React, { useState } from "react";
import style from "./chat.css";

export default props => {
  const [message, setMessage] = useState("");
  const { handleSubmit, messages } = props;

  return (
    <div className={style.wrapper}>
      <div className={style.messages}>
        {messages.map((m, i) => (
          <div className={style.message} key={i}>{m}</div>
        ))}
      </div>
      <form className={style.form}
        onSubmit={e => {
          handleSubmit(e, message);
          setMessage("");
        }}
      >
        <textarea
          className={style.input}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleSubmit(e, message);
              setMessage("");
            }
          }}
        />
      </form>
    </div>
  );
};
