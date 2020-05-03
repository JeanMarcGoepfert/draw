package io.vertx.draw;

import io.vertx.core.Vertx;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.handler.sockjs.BridgeEvent;
import io.vertx.redis.RedisClient;

public class EventBusHandler {
  private RedisClient client;
  private Vertx vertx;

  public EventBusHandler(RedisClient client, Vertx vertx) {
    this.client = client;
    this.vertx = vertx;
  }

  public void newDrawing(BridgeEvent event) {
    JsonObject body = event.getRawMessage().getJsonObject("body");
    String roomId = body.getString("roomId");
    String userId = body.getString("user");
    String drawingData = body.getJsonObject("data").getJsonObject("drawing").getString("value");

    client.get(roomId, r -> {
      Room room = Json.decodeValue(r.result(), Room.class);
      Drawing drawing = new Drawing(drawingData);
      room.addDrawing(userId, drawing);
      client.set(roomId, Json.encode(room), b -> {});
    });
  }

  public void newMessage(BridgeEvent event) {
    JsonObject body = event.getRawMessage().getJsonObject("body");
    String roomId = body.getString("roomId");
    JsonObject messageJson = body.getJsonObject("data");

    client.get(roomId, r -> {
      Room room = Json.decodeValue(r.result(), Room.class);
      Message message = Json.decodeValue(messageJson.toString(), Message.class);
      room.addMessage(message);
      client.set(roomId, Json.encodePrettily(room), b -> {});
    });

  }
}
