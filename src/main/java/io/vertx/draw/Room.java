package io.vertx.draw;

import java.util.ArrayList;
import java.util.HashMap;

public class Room {
  private final String id;
  private HashMap<String, User> users = new HashMap<>();

  public Room(String id) {
    this.id = id;
  }

  public Room(String id, HashMap<String, User> users) {
    this.id = id;
    this.users = users;
  }

  public String getId() {
    return id;
  }

  public void setUsers(User user) {
    users.put(user.getId(), user);
  };

  public HashMap<String, User> getUsers() {
    return users;
  }

  @Override
  public String toString() {
    return "Room{id='" + id + "'}";
  }
}
