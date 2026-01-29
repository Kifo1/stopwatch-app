import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [running, setRunning] = useState(false);

  async function stopStopwatch() {
    setRunning(await invoke("stop_stopwatch"));
  }

  async function startStopwatch() {
    setRunning(await invoke("start_stopwatch"));
  }

  return (
    <main className="flex flex-col gap-5">
      <button className="hover:cursor-pointer" onClick={startStopwatch}>
        Start stopwatch
      </button>
      <button className="hover:cursor-pointer" onClick={stopStopwatch}>
        Stop stopwatch
      </button>
      <p>{running ? "Stopwatch running" : "Stopwatch paused"}</p>
    </main>
  );
}

export default App;
