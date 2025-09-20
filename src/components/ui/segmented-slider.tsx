import { motion } from 'framer-motion';
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
    <div className={cn("relative", className)}>
      <div className="flex bg-muted rounded-2xl p-1 relative">
        {/* Background slider */}
        <motion.div
          className="absolute top-1 bottom-1 bg-accent rounded-xl"
          initial={false}
          animate={{
            left: `${(selectedIndex / options.length) * 100}%`,
            width: `${100 / options.length}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        {options.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 z-10",
              selectedIndex === index
                ? "text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}