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
  private String port;

  @Override
  public void start() {
    port = getPort();
    client = getRedisClient();

    System.out.println("Starting app");

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

  private RedisClient getRedisClient() {
    String redisUrlEnv = System.getenv("REDIS_URL");

    if (redisUrlEnv != null) {
      return RedisClient.create(vertx,
        new RedisOptions()
          .setPort(30919)
          .setHost("p80c19d5dd79d52770a2d2f4859db02f30712d5cc5c2aca2d9ae07d192b2c3365@ec2-50-17-235-242.compute-1.amazonaws.com"));
    } else {
      return RedisClient.create(vertx,
        new RedisOptions().setHost("192.168.42.45"));
    }
  }

  private String getPort() {
    String portEnv = System.getenv("PORT");
    return portEnv !=  null ? portEnv : "8080";
  }
}
