package io.vertx.draw;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.redis.RedisClient;

public class ApiRouter {
  private RedisClient client;
  private Vertx vertx;

  public ApiRouter(RedisClient client, Vertx vertx) {
    this.client = client;
    this.vertx = vertx;
  }

  public Router init() {
    RoomHandler roomHandler = new RoomHandler(client);
    Router router = Router.router(vertx);
    router.route().consumes("application/json");
    router.route().produces("application/json");
    router.post("/rooms").handler(roomHandler::createRoom);
    router.get("/rooms/:id").handler(roomHandler::getRoom);
    router.post("/rooms/:id/users").handler(roomHandler::newUser);

    return router;
  }
}
