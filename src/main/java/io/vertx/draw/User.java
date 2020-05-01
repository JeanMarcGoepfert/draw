package io.vertx.draw;

public class User {
  private String id;
  private String name;

  public User() {}

  public User(String id, String name) {
    this.id = id;
    this.name = name;
  }

  public String getId() {
    return id;
  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setId(String id) {
    this.id = id;
  }

  @Override
  public String toString() {
    return "Room{id='" + id + "' name='" + name +"'}";
  }
}
