package io.vertx.draw;

public class Drawing {
  private String value;

  public Drawing() {}

  public Drawing(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  @Override
  public String toString() {
    return "Drawing{value='" + value + "'}";
  }
}
