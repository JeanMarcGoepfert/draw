package io.vertx.draw;

import io.vertx.core.AbstractVerticle;
import io.vertx.ext.bridge.BridgeEventType;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.ErrorHandler;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.bridge.PermittedOptions;
import io.vertx.ext.web.handler.StaticHandler;

public class MainVerticle extends AbstractVerticle {

  @Override
  public void start() {
    Router router = Router.router(vertx);
    Router eventBusRouter = eventBusHandler();
    router.route().handler(BodyHandler.create());
    router.mountSubRouter("/eventbus", eventBusRouter);
    router.mountSubRouter("/api", auctionApiRouter());
    router.route().failureHandler(errorHandler());
    router.route().handler(staticHandler());

    vertx.createHttpServer().requestHandler(router).listen(8080);
  }

  private Router auctionApiRouter() {
    RoomRepository repository = new RoomRepository(vertx.sharedData());
    RoomHandler handler = new RoomHandler(repository);

    Router router = Router.router(vertx);
    router.route().handler(BodyHandler.create());

    router.route().consumes("application/json");
    router.route().produces("application/json");

    router.route("/rooms/:id").handler(handler::initRoom);
    router.get("/rooms/:id").handler(handler::getRoom);
    router.patch("/rooms/:id").handler(handler::handleMessage);

    return router;
  }

  private ErrorHandler errorHandler() {
    return ErrorHandler.create();
  }

  private Router eventBusHandler() {
    BridgeOptions options = new BridgeOptions()
      .addOutboundPermitted(new PermittedOptions().setAddressRegex("room\\.[0-9]+"));

    Router router = SockJSHandler.create(vertx).bridge(options, event -> {
      if (event.type() == BridgeEventType.SOCKET_CREATED) {
        System.out.println("socket created");
      }
      event.complete(true);
    });

    return router;
  }

  private StaticHandler staticHandler() {
    return StaticHandler.create().setCachingEnabled(false);
  }
}
