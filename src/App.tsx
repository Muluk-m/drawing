import React, { useEffect, useRef } from "react";
import { SimpleDraw } from "./models";
import "./index.css";

function App() {
  const simpleDrawInstanceRef = useRef<SimpleDraw>();

  const init = () => {
    if (simpleDrawInstanceRef.current) return;

    const simpleDrawInstance = new SimpleDraw(
      document.getElementById("drawCanvas") as HTMLCanvasElement,
      {
        strokeStyle: "green",
        lineWidth: 3,
        drawType: "",
      }
    );

    simpleDrawInstanceRef.current = simpleDrawInstance;
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <canvas id="drawCanvas" />
      <div className="helper-panel">
        <span
          className="helper-panel-button"
          onClick={() => {
            simpleDrawInstanceRef.current?.clear();
          }}
        >
          清空
        </span>
        <span className="helper-panel-button">笔刷样式</span>
        <span className="helper-panel-button">线条风格</span>
        <span
          className="helper-panel-button"
          onClick={() => {
            simpleDrawInstanceRef.current?.useEraser();
          }}
        >
          橡皮擦
        </span>
        <span
          className="helper-panel-button"
          onClick={() => {
            simpleDrawInstanceRef.current?.revoke();
          }}
        >
          撤销
        </span>
        <span
          className="helper-panel-button"
          onClick={() => {
            simpleDrawInstanceRef.current?.save();
          }}
        >
          完成
        </span>
      </div>
    </div>
  );
}

export default App;
