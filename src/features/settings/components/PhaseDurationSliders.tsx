import { useState, useEffect } from 'react';
import { Coffee, LucideIcon, Sofa, Timer } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { CustomSlider } from '@shared/components/Slider';

interface SliderComponentProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  settingsKey: 'focus_duration' | 'short_break' | 'long_break';
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
}: Readonly<SliderComponentProps>) {
  const { settings, updateSettings } = useSettings();

  const [localValue, setLocalValue] = useState<number>(min);

  useEffect(() => {
    if (settings) {
      setLocalValue(settings[settingsKey]);
    }
  }, [settings, settingsKey]);

  const handleLiveChange = (val: number) => {
    setLocalValue(val);
  };

  const handleFinalChange = (val: number) => {
    if (settings) {
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
      <div className="flex flex-row items-center gap-5">
        <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-500">
          <Icon size={24} />
        </div>
        <div className="flex flex-col">
          <label className="text-left font-medium text-white">{title}</label>
          <label className="text-left text-sm font-light text-blue-200">{description}</label>
        </div>
      </div>
      <CustomSlider
        value={localValue}
        onChange={handleLiveChange}
        onChangeCommitted={handleFinalChange}
        step={step}
        min={min}
        max={max}
        marks={generateMarks(min, max, step)}
        valueLabelFormat={(value) => `${value}m`}
      />
    </div>
  );
}

export default function PhaseDurationSliders() {
  const { isLoading } = useSettings();

  if (isLoading) {
    return <div className="p-10 text-center text-white">Settings loading...</div>;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col divide-y divide-slate-200/10 overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-200/5">
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
          min={5}
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
