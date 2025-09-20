import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface YearsSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function YearsSlider({ value, onChange, className }: YearsSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const maxYears = 10;
  const percentage = (value / maxYears) * 100;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(event.target.value));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current value display */}
      <div className="text-center space-y-2">
        <div className="text-lg font-semibold text-foreground">
          Years in operation: {value}
        </div>
        <p className="text-sm text-muted-foreground">
          Some grants require minimum operating history
        </p>
      </div>

      {/* Custom slider */}
      <div className="relative px-4">
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          {/* Gradient track fill */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-magenta to-brand-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Custom range input (invisible) */}
        <input
          type="range"
          min="0"
          max={maxYears}
          value={value}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Custom thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 border-3 border-white shadow-lg rounded-full pointer-events-none"
          style={{
            left: `calc(${percentage}% - 12px)`,
            background: `linear-gradient(135deg, hsl(var(--brand-magenta)), hsl(var(--brand-gold)))`,
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
            boxShadow: isDragging 
              ? "0 0 20px hsl(var(--brand-gold) / 0.5)" 
              : "0 4px 12px hsl(var(--neutral-dark) / 0.2)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />

        {/* Labels */}
        <div className="flex justify-between text-sm text-muted-foreground mt-3">
          <span>New</span>
          <span>10+ years</span>
        </div>
      </div>
    </div>
  );
}