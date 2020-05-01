package io.vertx.draw;

public class Message {
  private String userId;
  private String userName;
  private String message;

  public Message() {
  }

  public Message(String userId, String userName, String message) {
    this.userId = userId;
    this.userName = userName;
    this.message = message;
  }


  public void setUserId(String userId) {
    this.userId = userId;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getMessage() {
    return message;
  }

  public String getUserId() {
    return userId;
  }


  public String getUserName() {
    return userName;
  }

  @Override
  public String toString() {
    return "Message{id='" + userId + "' name='" + userName +"'}";
  }
}
