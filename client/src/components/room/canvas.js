import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import Controls from "./canvasControls";
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
  const [brushColor, setBrushColor] = useState("#111111");
  const [brushSize, setBrushSize] = useState(2);
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

  const clear = () => {
    canvasRef.current.clear();
    handleDraw({
      getSaveData: () => {
        return '{"lines":[],"width":2000,"height":2000}';
      }
    });
  };

  return (
    <div className={style.contentWrapper}>
      <Controls
        clear={clear}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
      />

      {Object.keys(drawings)
        .filter(v => v !== userId)
          .map(user => {
          const drawing = drawings[user].value;
          return (
            <div className={style.canvas} key={user}>
              <CanvasDraw
                saveData={drawing}
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
          lazyRadius={5}
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
