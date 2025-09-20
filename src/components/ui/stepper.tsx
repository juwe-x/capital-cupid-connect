import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      {/* Desktop Stepper */}
      <ol className="hidden md:flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="flex items-center">
            <div
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                stepIdx < currentStep
                  ? "bg-accent border-accent text-accent-foreground"
                  : stepIdx === currentStep
                  ? "border-primary text-primary bg-primary/10"
                  : "border-muted text-muted-foreground"
              )}
            >
              {stepIdx < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            
            <div className="ml-3 min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  stepIdx <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p
                  className={cn(
                    "text-xs transition-colors duration-300",
                    stepIdx <= currentStep ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>

            {stepIdx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors duration-300",
                  stepIdx < currentStep ? "bg-accent" : "bg-muted"
                )}
              />
            )}
          </li>
        ))}
      </ol>

      {/* Mobile Stepper - Dots with step indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {steps.map((step, stepIdx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  stepIdx < currentStep
                    ? "bg-accent"
                    : stepIdx === currentStep
                    ? "bg-primary w-3 h-3"
                    : "bg-muted"
                )}
              />
              {stepIdx < steps.length - 1 && (
                <div
                  className={cn(
                    "w-4 h-0.5 mx-1 transition-colors duration-300",
                    stepIdx < currentStep ? "bg-accent" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {steps[currentStep]?.title}
          </p>
          <p className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>
    </nav>
  );
}