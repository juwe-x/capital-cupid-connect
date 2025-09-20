import { cn } from '@/lib/utils';

interface SegmentedSliderProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedSlider({ options, value, onChange, className }: SegmentedSliderProps) {
  const selectedIndex = options.findIndex(option => option.value === value);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex bg-muted/30 rounded-2xl p-1.5 relative border border-muted/50">
        {/* Background slider */}
        <div
          className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-accent to-brand-gold rounded-xl transition-all duration-300 ease-out shadow-sm"
          style={{
            left: `${(selectedIndex / options.length) * 100}%`,
            width: `${100 / options.length}%`,
          }}
        />
        
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 z-10",
              selectedIndex === index
                ? "text-white font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}