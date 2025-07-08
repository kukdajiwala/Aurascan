import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type AssessmentResult } from "@/lib/types";

interface LoadingStateProps {
  onComplete: (result: AssessmentResult) => void;
}

const steps = [
  "Analyzing resume content...",
  "Processing facial emotion data...",
  "Calculating trust metrics...",
  "Generating risk assessment...",
  "Finalizing recommendation...",
];

export default function LoadingState({ onComplete }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      
      setProgress((prev) => {
        if (prev < 100) {
          return prev + (100 / steps.length);
        }
        return 100;
      });
    }, 1500);

    // Simulate completion after all steps
    const timeout = setTimeout(() => {
      // This would normally be triggered by the actual API response
      // For now, we'll simulate it completing after the animation
    }, steps.length * 1500 + 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto slide-up">
      <Card className="glassmorphism rounded-2xl card-hover text-center">
        <CardContent className="p-12">
          <div className="mb-8">
            <div className="loading-spinner w-20 h-20 mx-auto mb-8"></div>
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--cyber-cyan)] to-purple-400 rounded-full flex items-center justify-center pulse-glow">
              <div className="loading-spinner w-16 h-16 border-4 border-black border-t-transparent"></div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold gradient-text mb-6">
            Processing Assessment
          </h3>
          
          <div className="space-y-6">
            <div className="bg-[var(--darker-surface)] rounded-lg p-4">
              <p className="text-gray-300 text-lg font-medium mb-2">{steps[currentStep]}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <span>Step {currentStep + 1} of {steps.length}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="w-full h-3 bg-[var(--dark-surface)]"
              />
            </div>
            
            <p className="text-gray-500 text-sm">
              Our AI is analyzing your candidate's resume and facial expressions to provide comprehensive insights...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
