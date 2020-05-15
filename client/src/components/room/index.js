import React from "react";
import EventBus from "vertx3-eventbus-client";
import Chat from "./chat";
import Header from "./header";
import NameForm from "./nameForm";
import Canvas from "./canvas";
import { omit } from "lodash";
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
      eventBus: new EventBus("/eventbus")
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
    const { eventBus } = this.state;
    eventBus.onopen = () => {
      eventBus.registerHandler(this.roomName, this.messageHandler.bind(this));
    };

    const roomId = this.props.match.params.id;

    fetch(`/api/rooms/${roomId}`).then(res => {
      if (res.status === 200) {
        res.json().then(room => {
          this.setState({
            room,
            messages: room.messages,
            drawings: omit(room.drawings, this.state.userId),
            initialDrawing:
              room.drawings[this.state.userId] &&
              room.drawings[this.state.userId].value
          });
        });
      }
    });
  }

  componentWillUnmount() {
    delete this.state.eventBus.handlers[this.roomName];
  }

  handleSubmit(e, message) {
    e.preventDefault();
    this.state.eventBus.publish(this.roomName, {
      type: "NEW_MESSAGE",
      userId: this.state.userId,
      roomId: this.roomId,
      data: {
        userId: this.state.userId,
        userName: this.state.userName,
        message
      }
    });
  }

  setUser(userId, userName) {
    window.localStorage.setItem("roomId", this.roomId);
    window.localStorage.setItem("userName", userName);
    window.localStorage.setItem("userId", userId);
    this.setState({ userId, userName, registeredRoomId: this.roomId });
  }

  render() {
    if (this.state.registeredRoomId !== this.roomId) {
      return (
        <NameForm roomId={this.roomId} setUser={this.setUser.bind(this)} />
      );
    }

    return (
      <div className={style.pageWrapper}>
        <Header
          text={`Room ${this.roomId}`}
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
            <Canvas
              drawings={this.state.drawings}
              userId={this.state.userId}
              initialDrawing={this.state.initialDrawing}
              eventBus={this.state.eventBus}
              roomName={this.roomName}
              roomId={this.roomId}
            />
          </div>
        </div>
      </div>
    );
  }
}
