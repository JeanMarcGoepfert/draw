package io.vertx.draw;


import io.vertx.core.shareddata.LocalMap;
import io.vertx.core.shareddata.SharedData;

import java.util.Optional;


public class RoomRepository {
  private SharedData sharedData;

  public RoomRepository(SharedData sharedData) {
    this.sharedData = sharedData;
  }

  public Optional<Room> getById(String auctionId) {
    LocalMap<String, String> auctionSharedData = this.sharedData.getLocalMap(auctionId);

    return Optional.of(auctionSharedData)
      .filter(m -> !m.isEmpty())
      .map(this::convertToRoom);
  }

  public void save(Room room) {
    LocalMap<String, String> auctionSharedData = this.sharedData.getLocalMap(room.getId());
    auctionSharedData.put("id", room.getId());
  }

  private Room convertToRoom(LocalMap<String, String> room) {
    return new Room(room.get("id"));
  }
}
