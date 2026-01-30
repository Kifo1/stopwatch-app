import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  async function stopStopwatch() {
    setRunning(await invoke("stop_timer"));
  }

  async function startStopwatch() {
    setRunning(await invoke("start_timer"));
  }

  useEffect(() => {
    let interval: number;
    if (running) {
      interval = setInterval(async () => {
        const elapsed: number = await invoke("get_elapsed_seconds");
        setSeconds(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  return (
    <main className="flex flex-col gap-5">
      <button className="hover:cursor-pointer" onClick={startStopwatch}>
        Start stopwatch
      </button>
      <button className="hover:cursor-pointer" onClick={stopStopwatch}>
        Stop stopwatch
      </button>
      <p>{running ? seconds : "Stopwatch paused"}</p>
    </main>
  );
}

export default App;
