import * as React from "react";
import * as RadixSlider from "@radix-ui/react-slider";

type YearsSliderProps = {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

export function YearsSlider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  className,
}: YearsSliderProps) {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Current value display */}
      <div className="text-center space-y-2">
        <div className="text-lg font-semibold text-foreground">
          Years in operation: {value}
        </div>
        <p className="text-sm text-muted-foreground">
          Some grants require minimum operating history
        </p>
      </div>

      {/* Root centers the thumb vertically via items-center */}
      <RadixSlider.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="relative flex w-full select-none touch-none items-center px-1 py-2"
        orientation="horizontal"
      >
        {/* Track */}
        <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200/80">
          {/* Gradient fill behind the thumb */}
          <RadixSlider.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#E91E63] to-[#F4B400]" />
        </RadixSlider.Track>

        {/* Thumb – centered on the track (no position tweaks) */}
        <RadixSlider.Thumb
          className="block h-5 w-5 rounded-full border-2 border-[#E91E63] bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#E91E63]/40 focus:ring-offset-2"
          aria-label="Years in operation"
        />
      </RadixSlider.Root>

      {/* Labels with breathing room so the thumb never collides visually */}
      <div className="mt-2 flex w-full justify-between px-1 text-sm text-slate-500">
        <span>New</span>
        <span>10+ years</span>
      </div>
    </div>
  );
}