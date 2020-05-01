import React from "react";
import EventBus from "vertx3-eventbus-client";
import Chat from "./chat";
import Header from "../header";
import NameForm from "./nameForm";
import CanvasDraw from "react-canvas-draw";

import style from "./index.css";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {},
      messages: [],
      message: "",
      drawings: {},
      userName: window.localStorage.getItem("userName"),
      userId: window.localStorage.getItem("userId"),
      registeredRoomId: window.localStorage.getItem("roomId"),
      eventBus: new EventBus("http://localhost:8080/eventbus", {
        sessionId: 10
      })
    };
  }

  messageHandler(_, message) {
    if (message.body.type === "NEW_MESSAGE") {
      const newMessage = message.body.data;
      const messages = [...this.state.messages, newMessage];
      this.setState({ messages });
    }

    if (message.body.type === "NEW_DRAWING") {
      if (message.body.user !== this.state.userId) {
        this.state.drawings[message.body.user] = message.body.data.drawing;
        this.setState({ drawings: this.state.drawings });
      }
    }
  }

  get roomName() {
    return `room.${this.props.match.params.id}`;
  }

  componentDidMount() {
    this.state.eventBus.onopen = () => {
      this.state.eventBus.registerHandler(
        this.roomName,
        this.messageHandler.bind(this)
      );
    };
  }

  componentWillUnmount() {
    delete this.state.eventBus.handlers["room." + this.props.match.params.id];
  }

  handleSubmit(e, message) {
    e.preventDefault();
    this.state.eventBus.publish(this.roomName, {
      type: "NEW_MESSAGE",
      userId: window.localStorage.getItem("userId"),
      data: {
        userId: window.localStorage.getItem("userId"),
        userName: window.localStorage.getItem("userName"),
        message
      }
    });
  }

  setUser(userId, userName) {
    const roomId = this.props.match.params.id;
    window.localStorage.setItem("roomId", roomId);
    window.localStorage.setItem("userName", userName);
    window.localStorage.setItem("userId", userId);
    this.setState({ userId, userName, registeredRoomId: roomId });
  }

  render() {
    console.log(this.state.drawings);
    if (this.state.registeredRoomId !== this.props.match.params.id) {
      return (
        <NameForm
          roomId={this.props.match.params.id}
          setUser={this.setUser.bind(this)}
        />
      );
    }

    return (
      <div className={style.pageWrapper}>
        <Header text={`Room ${this.props.match.params.id}`} />
        <div className={style.row}>
          <div className={style.chatWrapper}>
            <Chat
              handleSubmit={this.handleSubmit.bind(this)}
              messages={this.state.messages}
            />
          </div>
          <div className={style.contentWrapper}>
            {Object.keys(this.state.drawings).map(user => {
              return (
                <div className={style.otherCanvas} key={user}>
                  <CanvasDraw
                    saveData={this.state.drawings[user]}
                    canvasWidth={2000}
                    canvasHeight={2000}
                    brushRadius={5}
                    hideGrid={true}
                    immediateLoading={true}
                  />
                </div>
              );
            })}
            <div className={style.myCanvas}>
              <CanvasDraw
                key={this.state.userId}
                canvasWidth={2000}
                canvasHeight={2000}
                brushRadius={5}
                onChange={e => {
                  this.state.eventBus.publish(this.roomName, {
                    type: "NEW_DRAWING",
                    user: this.state.userId,
                    data: {
                      drawing: e.getSaveData()
                    }
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
