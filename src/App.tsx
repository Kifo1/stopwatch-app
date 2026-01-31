import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { formatMillis } from "./lib/utils.js";
import Button from "./components/Button";

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

  async function reset() {
    await invoke("reset_timer");
    setMillis(0);
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
    <main className="flex flex-col h-full gap-5 bg-blue-">
      <div className="h-100 flex justify-center">
        <div className="flex flex-col justify-center text-center">
          <span className="text-white font-extrabold text-6xl tracking-tight tabular-nums">
            {formatMillis(millis)}
          </span>
          <span className="text-gray-500 font-semibold text-lg uppercase">
            Timer
          </span>
        </div>
        <svg
          viewBox="0 0 100 100"
          className="absolute max-h-100 transform z-0 pointer-events-none"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-700 dark:text-surface-highlight"
          />
          <circle
            className="text-blue-500 dark:text-primary transition-all duration-700 ease-in-out shadow-glow"
            cx="50%"
            cy="50%"
            fill="transparent"
            r="45"
            stroke="currentColor"
            stroke-dasharray="71 70 71 70"
            stroke-dashoffset={isRunning ? "0" : "70"}
            stroke-linecap="round"
            stroke-width="3.5"
          ></circle>
        </svg>
      </div>
      <div className="flex gap-4 w-full justify-center">
        <Button onClick={isRunning ? stop : start}>
          {isRunning ? "Stop" : "Start"} timer
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </main>
  );
}

export default App;
