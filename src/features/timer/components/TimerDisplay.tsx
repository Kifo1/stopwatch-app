import { useEffect, useState } from "react";
import { formatMillis } from "@shared/lib/utils";
import { PomodoroPhases } from "./PomodoroPhases";

interface Props {
  millis: number;
  mode: "stopwatch" | "pomodoro";
  pomodoroPhase: number;
  isRunning: boolean;
}

export function TimerDisplay({
  millis,
  mode,
  pomodoroPhase,
  isRunning,
}: Props) {
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);

  useEffect(() => {
    const transitionTimeout = setTimeout(
      () => setTransitionsEnabled(true),
      200,
    );
    return () => clearTimeout(transitionTimeout);
  }, []);

  const ratio =
    mode === "pomodoro" ? millis / getMaxMillisByPhase(pomodoroPhase) : 0;
  const R = 45;
  const CIRC = 2 * Math.PI * R;

  function getMaxMillisByPhase(phase: number) {
    switch (phase) {
      case 0:
      case 2:
        return 25 * 60 * 1000;
      case 1:
        return 5 * 60 * 1000;
      case 3:
        return 10 * 60 * 1000;
      default:
        return 25 * 60 * 1000;
    }
  }

  return (
    <div className="relative h-100 w-100 grid grid-rows-[2fr_1fr]">
      <div className="flex flex-col mt-auto mb-10 justify-center text-center">
        <span className="text-white font-mono text-6xl font-bold tabular-nums">
          {formatMillis(millis)}
        </span>
        <span className="text-gray-500 font-semibold text-lg uppercase">
          {mode}
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
          strokeWidth="2"
          className="text-slate-700 dark:text-surface-highlight"
        />
        <circle
          className={`text-blue-500 dark:text-primary ${
            transitionsEnabled ? "transition-all duration-700 ease-in-out" : ""
          }`}
          cx="50%"
          cy="50%"
          transform={"rotate(-90 50 50)"}
          fill="transparent"
          r="45"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.25"
          strokeDasharray={
            mode === "stopwatch"
              ? "71 70 71 70"
              : (() => {
                  const visible = CIRC * ratio;
                  const gap = Math.max(0, CIRC - visible);
                  return `${visible} ${gap}`;
                })()
          }
          strokeDashoffset={(() => {
            if (mode === "stopwatch") return isRunning ? "0" : "70";
            const visible = CIRC * ratio;
            const gap = Math.max(0, CIRC - visible);
            const offset = gap / 2;
            return `${-offset}`;
          })()}
        ></circle>
      </svg>
      {mode === "pomodoro" && <PomodoroPhases currentPhase={pomodoroPhase} />}
    </div>
  );
}
