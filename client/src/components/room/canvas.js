import React, { useRef, useState } from "react";
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
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState("#ffc600");
  const [brushSize, setBrushSize] = useState(5);
  const [lazyRadius, setLazyRadius] = useState(5);
  const handleDraw = e => {
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
          brushColor={brushColor}
          brushRadius={brushSize}
          lazyRadius={lazyRadius}
          ref={canvasRef}
          saveData={initialDrawing || undefined}
          immediateLoading={true}
          key={userId}
          canvasWidth={2000}
          canvasHeight={2000}
          onChange={handleDraw}
        />
      </div>
    </div>
  );
};
