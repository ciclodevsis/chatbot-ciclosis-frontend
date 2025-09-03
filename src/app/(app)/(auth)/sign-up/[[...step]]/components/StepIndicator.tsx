// CAMINHO: app/(auth)/sign-up/[[...step]]/components/StepIndicator.tsx
import { Check } from "lucide-react";

export const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => {
    return (
        <nav aria-label="Progress" className="w-full">
            <ol role="list" className="flex items-center">
                {steps.map((step, index) => {
                    const stepIndex = index + 1;
                    const status = currentStep > stepIndex ? 'complete' : currentStep === stepIndex ? 'current' : 'upcoming';
                    return (
                        <li key={step} className={`relative flex w-full items-center ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className={`h-0.5 w-full ${status === 'complete' || status === 'current' ? 'bg-primary' : 'bg-gray-200'}`} />
                            </div>
                            <div className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 
                                ${status === 'complete' ? 'bg-primary text-white hover:bg-primary/90' : ''} 
                                ${status === 'current' ? 'border-2 border-primary bg-background text-primary' : ''} 
                                ${status === 'upcoming' ? 'border-2 border-gray-300 bg-background text-gray-400' : ''}`}>
                                {status === 'complete' ? <Check className="h-5 w-5" /> : <span>{stepIndex}</span>}
                            </div>
                            <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-center w-28 sm:w-auto font-medium text-muted-foreground">{step}</span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};