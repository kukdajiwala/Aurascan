import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Award } from "lucide-react";

interface CandidateData {
  id: number;
  name: string;
  position: string;
  overallScore: number;
  trustScore: number;
  riskScore: number;
  moodScore: number;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
}

export default function CandidateComparison() {
  const candidates: CandidateData[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Frontend Developer",
      overallScore: 87,
      trustScore: 78,
      riskScore: 22,
      moodScore: 85,
      recommendation: "HIRE",
      strengths: ["React expertise", "Strong portfolio", "Team leadership"],
      weaknesses: ["Limited backend experience"]
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Frontend Developer",
      overallScore: 72,
      trustScore: 65,
      riskScore: 35,
      moodScore: 72,
      recommendation: "REVIEW",
      strengths: ["Full-stack knowledge", "Problem solving"],
      weaknesses: ["Communication skills", "Project management"]
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      position: "Frontend Developer",
      overallScore: 58,
      trustScore: 42,
      riskScore: 58,
      moodScore: 45,
      recommendation: "REJECT",
      strengths: ["Creative design", "UI/UX focus"],
      weaknesses: ["Technical depth", "Reliability concerns"]
    }
  ];

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toUpperCase()) {
      case "HIRE": return "bg-green-500 text-white";
      case "REJECT": return "bg-red-500 text-white";
      default: return "bg-orange-500 text-white";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="glassmorphism fade-in">
      <CardHeader>
        <CardTitle className="flex items-center text-[var(--cyber-cyan)]">
          <Users className="mr-2 h-5 w-5" />
          Candidate Comparison - Frontend Developer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 text-gray-300">Candidate</th>
                <th className="text-center py-3 px-4 text-gray-300">Overall</th>
                <th className="text-center py-3 px-4 text-gray-300">Trust</th>
                <th className="text-center py-3 px-4 text-gray-300">Risk</th>
                <th className="text-center py-3 px-4 text-gray-300">Mood</th>
                <th className="text-center py-3 px-4 text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-gray-300">Key Points</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-gray-700 hover:bg-[var(--darker-surface)]">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[var(--cyber-cyan)] rounded-full flex items-center justify-center">
                        <span className="text-black font-semibold text-xs">
                          {candidate.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{candidate.name}</p>
                        <p className="text-xs text-gray-400">{candidate.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="space-y-1">
                      <span className={`text-lg font-bold ${getScoreColor(candidate.overallScore)}`}>
                        {candidate.overallScore}
                      </span>
                      <Progress value={candidate.overallScore} className="h-1 w-16 mx-auto" />
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`font-semibold ${getScoreColor(candidate.trustScore)}`}>
                      {candidate.trustScore}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`font-semibold ${getScoreColor(100 - candidate.riskScore)}`}>
                      {candidate.riskScore}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`font-semibold ${getScoreColor(candidate.moodScore)}`}>
                      {candidate.moodScore}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <Badge className={getRecommendationColor(candidate.recommendation)}>
                      {candidate.recommendation}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-green-400 mb-1">Strengths:</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.strengths.slice(0, 2).map((strength, idx) => (
                            <span key={idx} className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-red-400 mb-1">Areas of concern:</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.weaknesses.slice(0, 1).map((weakness, idx) => (
                            <span key={idx} className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-[var(--darker-surface)] rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-4 w-4 text-[var(--cyber-cyan)]" />
            <span className="font-medium text-white">Recommendation Summary</span>
          </div>
          <p className="text-sm text-gray-300">
            Based on comprehensive AI analysis, <strong>Sarah Johnson</strong> ranks highest with an 87% overall score, 
            demonstrating strong technical skills and positive behavioral indicators. Consider for immediate hire.
            <strong> Michael Chen</strong> shows potential but requires additional evaluation before final decision.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}