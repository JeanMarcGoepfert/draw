package io.vertx.draw;

import io.vertx.core.AbstractVerticle;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.ErrorHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.redis.RedisClient;
import io.vertx.redis.RedisOptions;

public class MainVerticle extends AbstractVerticle {
  private RedisClient client;

  @Override
  public void start() {
    client = RedisClient.create(vertx,
      new RedisOptions().setHost("192.1sdasd68.42.45"));
    String portEnv = System.getenv("PORT");
    String port = portEnv !=  null ? portEnv : "8080";

    System.out.println(port);
    System.out.println("starting");

    Router router = Router.router(vertx);
    router.route().handler(BodyHandler.create());
    router.mountSubRouter("/eventbus", new EventBusRouter(client, vertx).init());
    router.mountSubRouter("/api", new ApiRouter(client, vertx).init());
    router.route().failureHandler(errorHandler());
    router.route().handler(staticHandler());
    vertx.createHttpServer().requestHandler(router).listen(Integer.parseInt(port));
  }

  private ErrorHandler errorHandler() {
    return ErrorHandler.create();
  }

  private StaticHandler staticHandler() {
    return StaticHandler.create().setWebRoot("client/dist").setCachingEnabled(false);
  }
}
