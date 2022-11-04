import React, { useEffect } from "react";
import { SimpleDraw } from "./models";

function App() {
  useEffect(() => {
    new SimpleDraw(document.getElementById("drawCanvas") as HTMLCanvasElement, {
      strokeStyle: "green",
      lineWidth: 3,
      drawType: ''
    });
  }, []);

  return (
    <div className="App">
      <canvas id="drawCanvas" style={{ height: "100vh", width: "100vw" }} />
    </div>
  );
}

export default App;
