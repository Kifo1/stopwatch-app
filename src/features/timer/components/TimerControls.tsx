import Button from "@shared/components/Button";
import { Pause, Play, TimerReset } from "lucide-react";

interface Props {
  isRunning: boolean;
  onStartStop: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, onStartStop, onReset }: Props) {
  return (
    <div className="flex gap-4 w-full justify-center">
      <Button onClick={onStartStop}>
        {isRunning ? <Pause /> : <Play />}
        {isRunning ? "Stop" : "Start"} timer
      </Button>
      <Button onClick={onReset}>
        <TimerReset />
      </Button>
    </div>
  );
}
