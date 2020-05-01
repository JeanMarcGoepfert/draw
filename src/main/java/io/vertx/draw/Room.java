package io.vertx.draw;

import java.awt.image.AreaAveragingScaleFilter;
import java.util.ArrayList;
import java.util.HashMap;

public class Room {
  private String id;
  private HashMap<String, User> users = new HashMap<>();
  private ArrayList<Message> messages = new ArrayList<>();
  private HashMap<String, Drawing> drawings = new HashMap<>();

  public Room(String id) {
    this.id = id;
  }

  public Room() {}

  public Room(String id, HashMap<String, User> users, ArrayList<Message> messages, HashMap<String, Drawing> drawings) {
    this.id = id;
    this.users = users;
    this.messages = messages;
    this.drawings = drawings;
  }

  public String getId() {
    return id;
  }

  public HashMap<String, Drawing> getDrawings() {
    return drawings;
  }

  public ArrayList<Message> getMessages() {
    return messages;
  }

  public void setDrawings(HashMap<String, Drawing> drawings) {
    this.drawings = drawings;
  };

  public void setUsers(HashMap<String, User> users) {
    this.users = users;
  };

  public void setMessages(ArrayList<Message> messages) {
    this.messages = messages;
  };

  public void addDrawing(String userId, Drawing drawing) {
    drawings.put(userId, drawing);
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
