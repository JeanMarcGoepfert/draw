package io.vertx.draw;

import java.util.ArrayList;
import java.util.HashMap;

public class Room {
  private String id;
  private HashMap<String, User> users = new HashMap<>();
  private ArrayList<Message> messages = new ArrayList<>();

  public Room(String id) {
    this.id = id;
  }

  public Room() {}

  public Room(String id, HashMap<String, User> users, ArrayList<Message> messages) {
    this.id = id;
    this.users = users;
    this.messages = messages;
  }

  public String getId() {
    return id;
  }

  public ArrayList<Message> getMessages() {
    return messages;
  }

  public void setUsers(HashMap<String, User> users) {
    this.users = users;
  };

  public void setMessages(ArrayList<Message> messages) {
    this.messages = messages;
  };

  public void addUser(User user) {
    users.put(user.getId(), user);
  };

  public void addMessage(Message message) {
    messages.add(message);
  };

  public HashMap<String, User> getUsers() {
    return users;
  }

  @Override
  public String toString() {
    return "Room{id='" + id + "'}";
  }
}
