import React from "react";
import EventBus from "vertx3-eventbus-client";
import Chat from "./chat";
import Header from "../header";
import style from "./index.css";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: "",
      eventBus: new EventBus("http://localhost:8080/eventbus")
    };
  }

  messageHandler(_, message) {
    const decodedMessage = JSON.parse(message.body).message;
    const messages = [...this.state.messages, decodedMessage];
    this.setState({ messages });
  }

  componentDidMount() {
    this.state.eventBus.onopen = () => {
      this.state.eventBus.registerHandler(
        "room." + this.props.match.params.id,
        this.messageHandler.bind(this)
      );
    };
  }

  componentWillUnmount() {
    delete this.state.eventBus.handlers["room." + this.props.match.params.id];
  }

  handleSubmit(e, message) {
    e.preventDefault();

    return fetch(`/api/rooms/${this.props.match.params.id}`, {
      method: "PATCH",
      body: JSON.stringify({ message })
    }).then(_ => {
      console.log("posted ok");
    });
  }

  render() {
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
        </div>
      </div>
    );
  }
}
