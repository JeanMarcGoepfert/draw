package io.vertx.draw;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.User;
import io.vertx.ext.bridge.BridgeEventType;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.ErrorHandler;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.bridge.PermittedOptions;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.redis.RedisClient;
import io.vertx.redis.RedisOptions;
import java.util.regex.Pattern;

public class MainVerticle extends AbstractVerticle {
  private RedisClient client;
  @Override
  public void start() {
    client = RedisClient.create(vertx,
      new RedisOptions().setHost("192.168.42.45"));

    Router router = Router.router(vertx);
    Router eventBusRouter = eventBusHandler();
    router.route().handler(BodyHandler.create());
    router.mountSubRouter("/eventbus", eventBusRouter);
    router.mountSubRouter("/api", apiRouter());
    router.route().failureHandler(errorHandler());
    router.route().handler(staticHandler());

    vertx.createHttpServer().requestHandler(router).listen(8080);
  }

  private Router apiRouter() {
    RoomRepository repository = new RoomRepository(vertx.sharedData());
    RoomHandler roomHandler = new RoomHandler(repository);

    Router router = Router.router(vertx);
    router.route().handler(BodyHandler.create());

    router.route().consumes("application/json");
    router.route().produces("application/json");

    router.post("/rooms").handler(roomHandler::initRoom);
    router.get("/rooms/:id").handler(roomHandler::getRoom);
    router.post("/rooms/:id/users").handler(roomHandler::newUser);

    return router;
  }

  private ErrorHandler errorHandler() {
    return ErrorHandler.create();
  }

  private Router eventBusHandler() {

    final Pattern splitter = Pattern.compile("room\\.([a-f0-9]{8}(-[a-f0-9]{4}){4}[a-f0-9]{8})");

    BridgeOptions options = new BridgeOptions()
      .addOutboundPermitted(new PermittedOptions().setAddressRegex(splitter.toString()))
      .addInboundPermitted(new PermittedOptions().setAddressRegex(splitter.toString()));

    return SockJSHandler.create(vertx).bridge(options, event -> {
      System.out.println(event.getRawMessage());
      if (event.type() == BridgeEventType.SOCKET_CREATED) {
        System.out.println("socket created");
      }

      if (event.type() == BridgeEventType.SEND) {
        JsonObject eventBody = event.getRawMessage();
        event.complete(true);
      }


      event.complete(true);
    });
  }

  private StaticHandler staticHandler() {
    return StaticHandler.create().setCachingEnabled(false);
  }
}
