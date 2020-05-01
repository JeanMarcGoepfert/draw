import React from "react";
import EventBus from "vertx3-eventbus-client";
import Chat from "./chat";
import Header from "./header";
import NameForm from "./nameForm";
import CanvasDraw from "react-canvas-draw";
import { get, omit } from "lodash";

import style from "./index.css";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {},
      messages: [],
      message: "",
      drawings: {},
      initialDrawing: null,
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

    if (message.body.type === "NEW_USER") {
      this.setState({ room: message.body.data });
    }
  }

  get roomName() {
    return `room.${this.props.match.params.id}`;
  }

  get roomId() {
    return this.props.match.params.id;
  }

  componentDidMount() {
    this.state.eventBus.onopen = () => {
      this.state.eventBus.registerHandler(
        this.roomName,
        this.messageHandler.bind(this)
      );
    };

    const roomId = this.props.match.params.id;

    fetch(`/api/rooms/${roomId}`).then(res => {
      if (res.status === 200) {
        res.json().then(room => {
          console.log(room.drawings);
          this.setState({
            room,
            messages: room.messages,
            drawings: omit(room.drawings, this.state.userId),
            initialDrawing: (room.drawings[this.state.userId] || {}).value
          });
        });
      }
    });
  }

  componentWillUnmount() {
    delete this.state.eventBus.handlers["room." + this.props.match.params.id];
  }

  handleSubmit(e, message) {
    e.preventDefault();
    this.state.eventBus.publish(this.roomName, {
      type: "NEW_MESSAGE",
      userId: window.localStorage.getItem("userId"),
      roomId: this.roomId,
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

  get getRoomId() {
    return this.props.match.params.id;
  }

  render() {
    if (this.state.registeredRoomId !== this.props.match.params.id) {
      return (
        <NameForm
          roomId={this.props.match.params.id}
          setUser={this.setUser.bind(this)}
        />
      );
    }

    console.log(this.state.drawings);
    return (
      <div className={style.pageWrapper}>
        <Header
          text={`Room ${this.props.match.params.id}`}
          users={this.state.room && this.state.room.users}
        />
        <div className={style.row}>
          <div className={style.chatWrapper}>
            <Chat
              me={this.state.userId}
              handleSubmit={this.handleSubmit.bind(this)}
              messages={this.state.messages}
            />
          </div>
          <div className={style.contentWrapper}>
            {Object.keys(this.state.drawings)
              .filter(v => v === this.state.userId)
              .map(user => {
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
                immediateLoading={true}
                key={this.state.userId}
                canvasWidth={2000}
                canvasHeight={2000}
                brushRadius={5}
                onChange={e => {
                    this.state.eventBus.publish(this.roomName, {
                      type: "NEW_DRAWING",
                      user: this.state.userId,
                      roomId: this.getRoomId,
                      data: {
                        drawing: { value: e.getSaveData() }
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
