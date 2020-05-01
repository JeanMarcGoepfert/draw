import React, { useState, useRef, useEffect } from "react";
import style from "./chat.css";

export default props => {
  const [message, setMessage] = useState("");
  const { handleSubmit, messages } = props;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className={style.wrapper}>
      <div className={style.messagesWrapper}>
        <div className={style.messages}>
          <div className={style.scrollWrapper}>
            {messages.map((m, i) => (
              <div className={style.message} key={i}>
                {m.message} - { m.userName }
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className={style.formWrapper}>
        <div className={style.form}>
          <textarea
            className={style.input}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.key === "Enter") {
                handleSubmit(e, message);
                setMessage("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
