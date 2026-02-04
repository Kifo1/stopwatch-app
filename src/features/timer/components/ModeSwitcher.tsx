import Button from "@shared/components/Button";

interface Props {
  currentMode: "pomodoro" | "stopwatch";
  onSwitch: any;
}

export function ModeSwitcher({ currentMode, onSwitch }: Props) {
  return (
    <div className="flex gap-2 justify-center bg-slate-800 rounded-full w-fit p-1">
      <Button
        variant={currentMode === "stopwatch" ? "secondary" : "ghost"}
        scale={"sm"}
        onClick={() => onSwitch("stopwatch")}
      >
        Stopwatch
      </Button>
      <Button
        variant={currentMode === "pomodoro" ? "secondary" : "ghost"}
        scale={"sm"}
        onClick={() => onSwitch("pomodoro")}
      >
        Pomodoro
      </Button>
    </div>
  );
}
