package io.vertx.draw;

import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import io.vertx.redis.RedisClient;

import java.util.UUID;

public class RoomHandler {
  private final RedisClient client;

  public RoomHandler(RedisClient client) {
    this.client = client;
  }

  public void getRoom(RoutingContext context) {
    String roomId = context.request().getParam("id");

    client.get(roomId, r -> {
      Room room = Json.decodeValue(r.result(), Room.class);
      context.response()
        .putHeader("content-type", "application/json")
        .setStatusCode(200)
        .end(Json.encodePrettily(room));
    });
  }

  public void createRoom(RoutingContext context) {
    String uuid = UUID.randomUUID().toString();
    Room room = new Room(uuid);
    System.out.println("here1?");
    System.out.println(client);
    client.set(uuid, Json.encode(room), r -> {
      System.out.println("here?");
      System.out.println(r);
    });

    JsonObject response = new JsonObject().put("id", uuid);

    context.response().setStatusCode(200).end(response.toString());
  }
  public void newUser(RoutingContext context) {
    String roomId = context.request().getParam("id");
    String name = context.getBodyAsJson().getString("name");
    String userId = UUID.randomUUID().toString();
    JsonObject response = new JsonObject().put("id", userId);
    User user = new User(userId, name);

    client.get(roomId, r -> {
      Room room = Json.decodeValue(r.result(), Room.class);
      room.addUser(user);
      client.set(roomId, Json.encode(room), a -> {
        JsonObject jsonRoom = JsonObject.mapFrom(room);
        JsonObject eventBody = new JsonObject().put("data", jsonRoom).put("type", "NEW_USER");
        context.vertx().eventBus().publish("room." + roomId, eventBody);
      });
    });

    context.response()
      .putHeader("content-type", "application/json")
      .setStatusCode(200)
      .end(response.toString());
  }
}
