package io.vertx.draw;

import io.vertx.core.json.Json;
import io.vertx.ext.web.RoutingContext;

import java.util.Optional;

public class RoomHandler {
  private final RoomRepository repository;

  public RoomHandler(RoomRepository repository) {
    this.repository = repository;
  }

  public void getRoom(RoutingContext context) {
    String roomId = context.request().getParam("id");
    Optional<Room> room = this.repository.getById(roomId);

    if (room.isPresent()) {
      context.response()
        .putHeader("content-type", "application/json")
        .setStatusCode(200)
        .end(Json.encodePrettily(room.get()));
    } else {
      context.response()
        .putHeader("content-type", "application/json")
        .setStatusCode(404)
        .end();
    }
  }

  public void handleMessage(RoutingContext context) {
    String roomId = context.request().getParam("id");
    String message = context.getBodyAsJson().getString("message");

    System.out.println(String.format("Message received: %s", message));

    Room roomRequest = new Room(roomId);

    boolean valid = true;

    if (valid) {
      this.repository.save(roomRequest);
      System.out.println(String.format("RoomId: %s", roomId));
      System.out.println("room." + roomId);
      System.out.println(context.getBodyAsString());
      context.vertx().eventBus().publish("room." + roomId, context.getBodyAsString());
      context.response().setStatusCode(200).end("nice");
    } else {
      context.response().setStatusCode(422).end();
    }
  }

  public void initRoom(RoutingContext context) {
    String roomId = context.request().getParam("id");

    Optional<Room> room = this.repository.getById(roomId);
    if(!room.isPresent()) {
      this.repository.save(new Room(roomId));
    }

    context.next();
  }
}
