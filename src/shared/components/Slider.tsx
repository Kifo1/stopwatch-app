import { useRef, useState, useCallback } from 'react';
import { cn } from '@shared/lib/utils';

interface SliderMark {
  value: number;
  label: string;
}

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  marks?: SliderMark[];
  onChange?: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
  valueLabelFormat?: (value: number) => string;
  className?: string;
}

export function CustomSlider({
  value,
  min,
  max,
  step,
  marks,
  onChange,
  onChangeCommitted,
  valueLabelFormat,
  className,
}: Readonly<CustomSliderProps>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const clampToStep = useCallback(
    (raw: number) => {
      const stepped = Math.round((raw - min) / step) * step + min;
      return Math.min(max, Math.max(min, stepped));
    },
    [min, max, step],
  );

  const valueFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      return clampToStep(min + ratio * (max - min));
    },
    [min, max, clampToStep, value],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    onChange?.(valueFromClientX(e.clientX));
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    onChange?.(valueFromClientX(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    onChangeCommitted?.(valueFromClientX(e.clientX));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(max, value + step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(min, value - step);
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    else return;
    e.preventDefault();
    onChange?.(next);
    onChangeCommitted?.(next);
  };

  const showLabel = isDragging || isHovering;
  const thumbScale = isDragging ? 1.25 : isHovering ? 1.12 : 1;

  return (
    <div className={cn('px-2 py-4', className)}>
      <div
        ref={trackRef}
        className="relative flex h-2 w-full cursor-pointer touch-none items-center select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute h-1.5 w-full rounded-full bg-slate-200/10" />

        <div
          className="absolute h-1.5 rounded-full bg-blue-500 transition-[width] duration-100 ease-out"
          style={{ width: `${percentage}%` }}
        />

        {marks?.map((mark) => {
          const markPercentage = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={mark.value}
              className="absolute flex flex-col items-center"
              style={{ left: `${markPercentage}%`, transform: 'translateX(-50%)' }}
            >
              <span className="mt-10 text-xs text-blue-200/80">{mark.label}</span>
            </div>
          );
        })}

        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow-md transition-transform duration-100 ease-out focus:ring-4 focus:ring-blue-500/30 focus:outline-none"
          style={{
            left: `${percentage}%`,
            transform: `translate(-50%, -50%) scale(${thumbScale})`,
          }}
        >
          {showLabel && (
            <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg bg-blue-500 px-2 py-1 text-xs font-medium whitespace-nowrap text-white shadow-lg">
              {valueLabelFormat ? valueLabelFormat(value) : value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
