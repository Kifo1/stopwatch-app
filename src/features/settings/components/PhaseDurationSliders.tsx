import Slider from "@mui/material/Slider";
import { Coffee, LucideIcon, Sofa, Timer } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

interface SliderComponentProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  settingsKey: "focus_duration" | "short_break" | "long_break";
  min: number;
  max: number;
  step: number;
}

function SliderComponent({
  title,
  description,
  Icon,
  settingsKey,
  min,
  max,
  step,
}: SliderComponentProps) {
  const { settings, updateSettings } = useSettings();

  const currentValue = settings ? settings[settingsKey] : min;

  const handleFinalChange = (_: any, val: number | number[]) => {
    if (settings && typeof val === "number") {
      updateSettings({ ...settings, [settingsKey]: val });
    }
  };

  const generateMarks = (min: number, max: number, step: number) => {
    const marks = [];
    for (let i = min; i <= max; i += step) {
      marks.push({ value: i, label: `${i}` });
    }
    return marks;
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-row gap-5 items-center">
        <div className="text-blue-500 bg-blue-500/10 p-4 rounded-2xl">
          <Icon size={24} />
        </div>
        <div className="flex flex-col">
          <label className="text-white text-left font-medium">{title}</label>
          <label className="text-blue-200 text-left font-light text-sm">
            {description}
          </label>
        </div>
      </div>
      <div className="px-2">
        <Slider
          value={currentValue}
          onChangeCommitted={handleFinalChange}
          step={step}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value}m`}
          marks={generateMarks(min, max, step)}
          sx={{
            color: "#3b82f6",
            "& .MuiSlider-markLabel": {
              color: "white",
              fontSize: "0.85rem",
              opacity: 0.8,
            },
            "& .MuiSlider-valueLabel": {
              lineHeight: 1.2,
              fontSize: 12,
              background: "unset",
              padding: 0,
              width: 32,
              height: 32,
              borderRadius: "50% 50% 50% 0",
              backgroundColor: "#3b82f6",
              transformOrigin: "bottom left",
              transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
              "&::before": { display: "none" },
              "&.MuiSlider-valueLabelOpen": {
                transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
              },
              "& > *": { transform: "rotate(45deg)" },
            },
          }}
        />
      </div>
    </div>
  );
}

export default function PhaseDurationSliders() {
  const { isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="text-white text-center p-10">Settings loading...</div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col w-full max-w-2xl rounded-3xl border border-slate-200/10 bg-slate-200/5 overflow-hidden divide-y divide-slate-200/10">
        <SliderComponent
          title="Focus Duration"
          description="Length of single work session"
          Icon={Timer}
          settingsKey="focus_duration"
          min={5}
          max={60}
          step={5}
        />
        <SliderComponent
          title="Short break"
          description="Rest between work sessions"
          Icon={Coffee}
          settingsKey="short_break"
          min={2}
          max={15}
          step={1}
        />
        <SliderComponent
          title="Long break"
          description="Extended rest after focus sessions"
          Icon={Sofa}
          settingsKey="long_break"
          min={5}
          max={30}
          step={5}
        />
      </div>
    </div>
  );
}
