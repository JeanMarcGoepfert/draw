package io.vertx.draw;

import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import jdk.internal.org.jline.terminal.spi.JansiSupport;

import java.util.Optional;
import java.util.Random;
import java.util.UUID;

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
      context.vertx().eventBus().publish("room." + roomId, context.getBodyAsString());
      context.response().setStatusCode(200).end("nice");
    } else {
      context.response().setStatusCode(422).end();
    }
  }

  public void initRoom(RoutingContext context) {
    UUID uuid = UUID.randomUUID();
    JsonObject response = new JsonObject().put("id", uuid.toString());

    context.response().setStatusCode(200).end(response.toString());
  }
  public void newUser(RoutingContext context) {
    UUID uuid = UUID.randomUUID();
    JsonObject response = new JsonObject().put("id", uuid.toString());

    context.response()
      .putHeader("content-type", "application/json")
      .setStatusCode(200)
      .end(response.toString());
  }}
