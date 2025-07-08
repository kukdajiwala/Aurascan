import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Image, Target, AlertTriangle, CheckCircle2, Volume2 } from "lucide-react";
import { type AssessmentResult } from "@/lib/types";

interface DetailedAnalysisProps {
  result: AssessmentResult;
}

export default function DetailedAnalysis({ result }: DetailedAnalysisProps) {
  const skillsAnalysis = {
    technical: 85,
    communication: 72,
    leadership: 68,
    problemSolving: 91,
    teamwork: 79
  };

  const behavioralIndicators = [
    { trait: "Confidence", score: result.moodScore, status: "positive" },
    { trait: "Reliability", score: result.trustScore, status: "positive" },
    { trait: "Stress Management", score: 100 - result.riskScore, status: "positive" },
    { trait: "Communication", score: 78, status: "positive" },
    { trait: "Adaptability", score: 82, status: "positive" },
    ...(result.voiceSentiment ? [{ 
      trait: "Voice Confidence", 
      score: Math.round(result.voiceSentiment.confidence * 100), 
      status: "positive" as const 
    }] : [])
  ];

  const riskFactors = [
    { factor: "Experience Gap", severity: "low", description: "Minor gaps in required experience" },
    { factor: "Cultural Fit", severity: "medium", description: "Some alignment concerns with company culture" },
    { factor: "Availability", severity: "low", description: "Start date flexibility" }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      case "high": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Skills Breakdown */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center text-[var(--cyber-cyan)]">
            <Brain className="mr-2 h-5 w-5" />
            Skills Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(skillsAnalysis).map(([skill, score]) => (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300 capitalize">{skill.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Indicators */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center text-[var(--cyber-cyan)]">
            <Target className="mr-2 h-5 w-5" />
            Behavioral Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {behavioralIndicators.map((indicator) => (
              <div key={indicator.trait} className="bg-[var(--darker-surface)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">{indicator.trait}</span>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={indicator.score} className="flex-1 h-2" />
                  <span className={`text-sm font-semibold ${getScoreColor(indicator.score)}`}>
                    {indicator.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center text-[var(--cyber-cyan)]">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskFactors.map((risk, index) => (
              <div key={index} className="bg-[var(--darker-surface)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{risk.factor}</span>
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{risk.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Summary */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center text-[var(--cyber-cyan)]">
            <Brain className="mr-2 h-5 w-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-[var(--cyber-cyan)]" />
                <div>
                  <h4 className="font-medium text-white">Resume Analysis</h4>
                  <p className="text-sm text-gray-400">Extracted key qualifications and experience</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Image className="h-6 w-6 text-[var(--cyber-cyan)]" />
                <div>
                  <h4 className="font-medium text-white">Facial Emotion Analysis</h4>
                  <p className="text-sm text-gray-400">Detected mood: {result.moodText}</p>
                </div>
              </div>

              {result.voiceSentiment && (
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-6 w-6 text-purple-400" />
                  <div>
                    <h4 className="font-medium text-white">Voice Sentiment Analysis</h4>
                    <p className="text-sm text-gray-400">
                      {result.voiceSentiment.emotion} emotion, {result.voiceSentiment.tone} tone
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[var(--darker-surface)] rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Key Insights</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Strong technical background in relevant technologies</li>
                <li>• Demonstrates confidence and positive attitude</li>
                <li>• Good problem-solving and analytical skills</li>
                <li>• Minor concerns about cultural alignment</li>
                <li>• Overall positive assessment profile</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}