import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import phaseChangeSound from "@assets/pomodoro-phase-change.mp3";

export function useTimer() {
  const [stopwtachMillis, setStopwatchMillis] = useState(0);
  const [pomodoroMillis, setPomodoroMillis] = useState(25 * 60 * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"stopwatch" | "pomodoro">("stopwatch");
  const [pomodoroPhase, setPomodoroPhase] = useState(0);
  const phaseChangeAudio = new Audio(phaseChangeSound);

  const start = async () => {
    await invoke("start_timer");
    setIsRunning(true);
  };

  const stop = async () => {
    await invoke("stop_timer");
    setIsRunning(false);
  };

  const reset = async () => {
    await invoke("reset_timer");
    mode === "stopwatch"
      ? setStopwatchMillis(0)
      : setPomodoroMillis(25 * 60 * 1000);
  };

  const switchMode = async (newMode: "stopwatch" | "pomodoro") => {
    await stop();
    setMode(newMode);
    await invoke("switch_timer_mode", { timerMode: newMode });
  };

  useEffect(() => {
    const unlistenTick = listen<number>("timer-tick", (event) =>
      mode === "stopwatch"
        ? setStopwatchMillis(event.payload)
        : setPomodoroMillis(event.payload),
    );
    const unlistenPhase = listen<number>("pomodoro-phase", (event) => {
      setPomodoroPhase(event.payload);
    });
    const unlistenPhaseSound = listen("pomodoro-phase-sound", () => {
      phaseChangeAudio.play();
    });

    return () => {
      unlistenTick.then((f) => f());
      unlistenPhase.then((f) => f());
      unlistenPhaseSound.then((f) => f());
    };
  }, [mode]);

  return {
    stopwtachMillis,
    pomodoroMillis,
    isRunning,
    mode,
    pomodoroPhase,
    start,
    stop,
    reset,
    switchMode,
  };
}
