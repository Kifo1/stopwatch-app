import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [millis, setMillis] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  async function start() {
    await invoke("start_timer");
    setIsRunning(true);
  }

  async function stop() {
    await invoke("stop_timer");
    setIsRunning(false);
  }

  useEffect(() => {
    const unlisten = listen<number>("timer-tick", (event) => {
      setMillis(event.payload);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <main className="flex flex-col gap-5">
      <button className="hover:cursor-pointer" onClick={start}>
        Start stopwatch
      </button>
      <button className="hover:cursor-pointer" onClick={stop}>
        Stop stopwatch
      </button>
      <p>{isRunning ? (millis / 1000).toFixed(1) : "Stopwatch paused"}</p>
    </main>
  );
}

export default App;
