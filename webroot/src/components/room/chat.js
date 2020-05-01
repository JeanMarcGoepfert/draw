import React, { useState, useRef, useEffect } from "react";
import style from "./chat.css";

export default props => {
  const [message, setMessage] = useState("");
  const { handleSubmit, messages, me } = props;

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
            {messages.map((m, i) => {
              if (me === m.userId) {
                return (
                  <div className={style.myMessage} key={i}>
                    <div className={style.text}>{m.message}</div>
                    <div className={style.name}>me</div>
                  </div>
                );
              } else {
                return (
                  <div className={style.otherMessage} key={i}>
                    <div className={style.text}>{m.message}</div>
                    <div className={style.name}>{m.userName}</div>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className={style.formWrapper}>
        <div className={style.form}>
          <textarea
            minLength={1}
            className={style.input}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.key === "Enter" && message.trim().length > 0) {
                handleSubmit(e, message.trim());
                setMessage("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
