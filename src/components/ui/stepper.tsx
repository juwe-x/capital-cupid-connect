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
      {/* Floating Island Stepper */}
      <div className="flex justify-center">
        <div className="inline-flex items-center bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-6 py-2 border border-white/20">
          {steps.map((step, stepIdx) => (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300",
                  stepIdx < currentStep
                    ? "bg-brand-gold text-white"
                    : stepIdx === currentStep
                    ? "bg-brand-magenta text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {stepIdx < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="ml-2 mr-3">
                <p
                  className={cn(
                    "text-xs font-medium transition-colors duration-300 whitespace-nowrap",
                    stepIdx <= currentStep ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
              </div>

              {/* Progress Line */}
              {stepIdx < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 mx-1 transition-colors duration-300",
                    stepIdx < currentStep ? "bg-brand-gold" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}