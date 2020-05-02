package io.vertx.draw;

import io.vertx.core.Vertx;
import io.vertx.ext.bridge.BridgeEventType;
import io.vertx.ext.bridge.PermittedOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;
import io.vertx.redis.RedisClient;

import java.util.regex.Pattern;

public class EventBusRouter {
  private RedisClient client;
  private Vertx vertx;
  final private Pattern roomRegex = Pattern.compile("room\\.([a-f0-9]{8}(-[a-f0-9]{4}){4}[a-f0-9]{8})");

  public EventBusRouter(RedisClient client, Vertx vertx) {
    this.client = client;
    this.vertx = vertx;
  }

  public Router init() {
    BridgeOptions options = new BridgeOptions()
      .addOutboundPermitted(new PermittedOptions().setAddressRegex(roomRegex.toString()))
      .addInboundPermitted(new PermittedOptions().setAddressRegex(roomRegex.toString()));

    return SockJSHandler.create(vertx).bridge(options, event -> {
      final EventBusHandler handler = new EventBusHandler(client, vertx);

      if (event.type() == BridgeEventType.PUBLISH) {
        String eventType = event.getRawMessage().getJsonObject("body").getString("type");

        if (eventType.equals("NEW_DRAWING")) {
          handler.newDrawing(event);
        }

        if (eventType.equals("NEW_MESSAGE")) {
          handler.newMessage(event);
        }
      }

      event.complete(true);
    });
  }

}
