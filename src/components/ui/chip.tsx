import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'industry' | 'need';
  icon?: React.ReactNode;
}

export function Chip({ 
  selected = false, 
  children, 
  variant = 'default',
  icon,
  className,
  ...props 
}: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20",
        selected
          ? "border-accent bg-accent/10 text-accent-foreground ring-2 ring-accent/20 shadow-sm"
          : "border-muted text-muted-foreground hover:border-accent/50 hover:text-accent-foreground hover:bg-accent/5",
        variant === 'industry' && "min-w-[120px] justify-center",
        variant === 'need' && "hover-lift",
        className
      )}
      {...props}
    >
      {icon && (
        <span className={cn(
          "transition-colors duration-200",
          selected ? "text-accent" : "text-muted-foreground"
        )}>
          {icon}
        </span>
      )}
      
      <span className="truncate">{children}</span>
      
      {selected && (
        <Check className="w-4 h-4 text-accent flex-shrink-0" />
      )}
    </button>
  );
}