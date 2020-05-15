import React from "react";
import style from "./canvasControls.css";

export default ({
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  clear
}) => {
  const colors = [
    "#007bff",
    "#6c757d",
    "#28a745",
    "#dc3545",
    "#ffc107",
    "#111111"
  ];

  return (
    <div className={style.controls}>
      <div className={style.size}>
        <div className={style.label}>
          Brush Size:
          <span
            className={style.brushSize}
            style={{ transform: `scale(${brushSize * 0.7})` }}
          />
        </div>
        <input
          className={style.slider}
          type="range"
          value={brushSize}
          min="1"
          max="6"
          onChange={e => setBrushSize(parseInt(e.target.value))}
        />
      </div>
      <div className={style.colors}>
        <div className={style.label}>Brush color:</div>
        {colors.map(c => {
          return (
            <div
              key={c}
              onClick={() => setBrushColor(c)}
              className={`${style.color} ${
                brushColor === c ? style.active : ""
              }`}
              style={{ background: c }}
            ></div>
          );
        })}
      </div>

      <button className={style.button} onClick={clear}>Clear my drawing</button>
    </div>
  );
};
