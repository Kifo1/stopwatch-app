import Button from "@shared/components/Button";

interface Props {
  isRunning: boolean;
  onStartStop: any;
  onReset: any;
}

export function TimerControls({ isRunning, onStartStop, onReset }: Props) {
  return (
    <div className="flex gap-4 w-full justify-center">
      <Button onClick={onStartStop}>
        {isRunning ? "Stop" : "Start"} timer
      </Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
}
