import React from "react";
import CanvasDraw from "react-canvas-draw";
import style from "./canvas.css";

export default ({
  drawings,
  userId,
  initialDrawing,
  eventBus,
  roomName,
  roomId
}) => {
  const handleDraw = (e) => {
    if (eventBus.state === 0) {
      return;
    }

    eventBus.publish(roomName, {
      type: "NEW_DRAWING",
      user: userId,
      roomId: roomId,
      data: { drawing: { value: e.getSaveData() } }
    });
  };

  return (
    <div className={style.contentWrapper}>
      {Object.keys(drawings)
        .filter(v => v !== userId)
        .map(user => {
          return (
            <div className={style.canvas} key={user}>
              <CanvasDraw
                saveData={drawings[user].value}
                canvasWidth={2000}
                canvasHeight={2000}
                brushRadius={5}
                hideGrid={true}
                immediateLoading={true}
              />
            </div>
          );
        })}
      <div className={style.canvas}>
        <CanvasDraw
          saveData={initialDrawing || undefined}
          immediateLoading={true}
          key={userId}
          canvasWidth={2000}
          canvasHeight={2000}
          brushRadius={5}
          onChange={handleDraw}
        />
      </div>
    </div>
  );
};
