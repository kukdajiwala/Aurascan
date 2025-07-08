import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssessmentForm from "@/components/assessment-form";
import LoadingState from "@/components/loading-state";
import ResultsDisplay from "@/components/results-display";
import CustomizationPanel from "@/components/customization-panel";
import Dashboard from "@/components/dashboard";
import DetailedAnalysis from "@/components/detailed-analysis";
import CandidateComparison from "@/components/candidate-comparison";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BarChart3, Users, FileText } from "lucide-react";
import { type AssessmentResult, type AppConfig } from "@/lib/types";

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "form" | "loading" | "results">("dashboard");
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: appConfig } = useQuery<AppConfig>({
    queryKey: ["/api/config"],
  });

  const handleAssessmentStart = () => {
    setCurrentView("loading");
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    setCurrentView("results");
  };

  const handleNewAssessment = () => {
    setAssessmentResult(null);
    setCurrentView("form");
  };

  const handleStartAssessment = () => {
    setCurrentView("form");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="py-6 px-4 nav-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="slide-up">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                {appConfig?.appName || "AURASCAN"}
              </h1>
              <p className="text-gray-400 text-lg font-medium">AI-Powered HR Assessment Platform</p>
            </div>
            
            {/* Navigation */}
            <nav className="flex space-x-4 slide-up">
              <Button
                variant={currentView === "dashboard" ? "default" : "ghost"}
                onClick={() => setCurrentView("dashboard")}
                className={`flex items-center space-x-2 hover-glow ${
                  currentView === "dashboard" 
                    ? "bg-[var(--cyber-cyan)] text-black" 
                    : "hover:bg-[var(--dark-surface)]"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={currentView === "form" || currentView === "loading" || currentView === "results" ? "default" : "ghost"}
                onClick={() => setCurrentView("form")}
                className={`flex items-center space-x-2 hover-glow ${
                  currentView === "form" || currentView === "loading" || currentView === "results"
                    ? "bg-[var(--cyber-cyan)] text-black" 
                    : "hover:bg-[var(--dark-surface)]"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>New Assessment</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {currentView === "dashboard" && (
          <Dashboard onNewAssessment={handleStartAssessment} />
        )}

        {currentView === "form" && (
          <AssessmentForm 
            onAssessmentStart={handleAssessmentStart}
            onAssessmentComplete={handleAssessmentComplete}
          />
        )}
        
        {currentView === "loading" && (
          <LoadingState onComplete={handleAssessmentComplete} />
        )}
        
        {currentView === "results" && assessmentResult && (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[var(--dark-surface)]">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="detailed" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Detailed Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Comparison</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <ResultsDisplay 
                  result={assessmentResult}
                  onNewAssessment={handleNewAssessment}
                  appConfig={appConfig}
                />
              </TabsContent>
              
              <TabsContent value="detailed" className="mt-6">
                <DetailedAnalysis result={assessmentResult} />
              </TabsContent>
              
              <TabsContent value="comparison" className="mt-6">
                <CandidateComparison />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {showCustomization && (
          <CustomizationPanel />
        )}
      </main>

      {/* Settings Toggle */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setShowCustomization(!showCustomization)}
          className="w-12 h-12 rounded-full bg-[var(--cyber-cyan)] text-black hover-glow p-0"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
