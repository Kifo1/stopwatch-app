import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { formatMillis } from "../lib/utils.js";
import Button from "../components/ui/Button.js";

export default function Timer() {
  const [stopwatchMillis, setStopwatchMillis] = useState(0);
  const [pomodoroMillis, setPomodoroMillis] = useState(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"stopwatch" | "pomodoro">("stopwatch");
  const [pomodoroPhase] = useState(0);

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
    mode === "stopwatch"
      ? setStopwatchMillis(0)
      : setPomodoroMillis(25 * 60 * 1000);
  }

  async function switchMode(newMode: "stopwatch" | "pomodoro") {
    await stop();
    setMode(newMode);
    await invoke("switch_timer_mode", { timerMode: newMode });
  }

  useEffect(() => {
    const unlisten = listen<number>("timer-tick", (event) => {
      mode === "stopwatch"
        ? setStopwatchMillis(event.payload)
        : setPomodoroMillis(event.payload);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, [mode]);

  return (
    <div className="flex flex-col h-full gap-5 items-center">
      <div className="flex gap-2 justify-center bg-slate-800 rounded-full w-fit p-1">
        <Button
          variant={mode === "stopwatch" ? "secondary" : "ghost"}
          scale={"sm"}
          onClick={() => switchMode("stopwatch")}
        >
          Stopwatch
        </Button>
        <Button
          variant={mode === "pomodoro" ? "secondary" : "ghost"}
          scale={"sm"}
          onClick={() => switchMode("pomodoro")}
        >
          Pomodoro
        </Button>
      </div>
      <div className="h-100 w-100 grid grid-rows-[2fr_1fr]">
        <div className="flex flex-col mt-auto mb-10 justify-center text-center">
          <span className="text-white font-mono text-6xl font-bold tabular-nums">
            {formatMillis(
              mode === "stopwatch" ? stopwatchMillis : pomodoroMillis,
            )}
          </span>
          <span className="text-gray-500 font-semibold text-lg uppercase">
            {mode}
          </span>
        </div>
        {mode === "pomodoro" && (
          <>
            <div className="text-center mt-auto mb-15">
              <ul className="flex gap-2 justify-center">
                <li className="">
                  <span
                    className={`${pomodoroPhase === 0 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
                  ></span>
                </li>
                <li>
                  <span
                    className={`${pomodoroPhase === 1 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
                  ></span>{" "}
                </li>
                <li>
                  <span
                    className={`${pomodoroPhase === 2 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
                  ></span>{" "}
                </li>
                <li>
                  <span
                    className={`${pomodoroPhase === 3 ? "bg-blue-500 glow" : "bg-gray-700"} inline-block w-2.5 h-2.5 rounded-full`}
                  ></span>{" "}
                </li>
              </ul>
              <span className="text-gray-500 font-semibold text-sm uppercase">
                Focus
              </span>
            </div>
          </>
        )}
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
            strokeWidth="2"
            className="text-slate-700 dark:text-surface-highlight"
          />
          <circle
            className="text-blue-500 dark:text-primary transition-all duration-700 ease-in-out"
            cx="50%"
            cy="50%"
            fill="transparent"
            r="45"
            stroke="currentColor"
            stroke-dasharray="71 70 71 70"
            stroke-dashoffset={isRunning ? "0" : "70"}
            stroke-linecap="round"
            stroke-width="2.25"
          ></circle>
        </svg>
      </div>
      <div className="flex gap-4 w-full justify-center">
        <Button onClick={isRunning ? stop : start}>
          {isRunning ? "Stop" : "Start"} timer
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}
