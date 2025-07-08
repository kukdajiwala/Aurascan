import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, AlertCircle, CheckCircle, Clock, Filter, Brain, Zap } from "lucide-react";
import { type AssessmentResult } from "@/lib/types";
import Notifications from "./notifications";

interface DashboardProps {
  onNewAssessment: () => void;
}

export default function Dashboard({ onNewAssessment }: DashboardProps) {
  const [filter, setFilter] = useState<"all" | "hire" | "review" | "reject">("all");

  // Mock data for recent assessments
  const mockAssessments: AssessmentResult[] = [
    {
      id: 1,
      fullName: "Sarah Johnson",
      evaluationType: "comprehensive",
      moodScore: 85,
      moodText: "Confident",
      trustScore: 78,
      riskScore: 22,
      recommendation: "HIRE",
      reason: "Strong technical background and positive attitude",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 2,
      fullName: "Michael Chen",
      evaluationType: "trust",
      moodScore: 72,
      moodText: "Neutral",
      trustScore: 65,
      riskScore: 35,
      recommendation: "REVIEW",
      reason: "Good qualifications but needs further evaluation",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: 3,
      fullName: "Emma Rodriguez",
      evaluationType: "risk",
      moodScore: 45,
      moodText: "Concerned",
      trustScore: 42,
      riskScore: 58,
      recommendation: "REJECT",
      reason: "High risk indicators detected in assessment",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    }
  ];

  const stats = {
    totalAssessments: 127,
    hireRate: 45,
    avgTrustScore: 67,
    pendingReviews: 8
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toUpperCase()) {
      case "HIRE": return "bg-green-500 text-white";
      case "REJECT": return "bg-red-500 text-white";
      default: return "bg-orange-500 text-white";
    }
  };

  const filteredAssessments = filter === "all" 
    ? mockAssessments 
    : mockAssessments.filter(a => a.recommendation.toLowerCase() === filter);

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Section */}
      <div className="text-center py-8 slide-up">
        <h2 className="text-3xl font-bold gradient-text mb-4">Welcome to Your Assessment Dashboard</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Monitor your HR assessments, track hiring metrics, and make data-driven decisions with AI-powered insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glassmorphism card-hover metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Assessments</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalAssessments}</p>
                <p className="text-xs text-green-400 mt-1">+12% from last month</p>
              </div>
              <div className="status-indicator">
                <Users className="h-10 w-10 text-[var(--cyber-cyan)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism card-hover metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Hire Rate</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.hireRate}%</p>
                <p className="text-xs text-green-400 mt-1">+5.2% from last month</p>
              </div>
              <div className="status-indicator">
                <TrendingUp className="h-10 w-10 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism card-hover metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Avg Trust Score</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.avgTrustScore}</p>
                <p className="text-xs text-blue-400 mt-1">Industry standard: 65</p>
              </div>
              <div className="status-indicator">
                <CheckCircle className="h-10 w-10 text-[var(--cyber-cyan)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism card-hover metric-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.pendingReviews}</p>
                <p className="text-xs text-orange-400 mt-1">Require attention</p>
              </div>
              <div className="status-indicator">
                <AlertCircle className="h-10 w-10 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card className="glassmorphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[var(--cyber-cyan)]">Recent Assessments</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-[var(--cyber-cyan)] text-black" : ""}
              >
                All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("hire")}
                className={filter === "hire" ? "bg-green-500 text-white" : ""}
              >
                Hire
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("review")}
                className={filter === "review" ? "bg-orange-500 text-white" : ""}
              >
                Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("reject")}
                className={filter === "reject" ? "bg-red-500 text-white" : ""}
              >
                Reject
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-[var(--darker-surface)] rounded-lg p-4 hover-glow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[var(--cyber-cyan)] rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold text-sm">
                        {assessment.fullName.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{assessment.fullName}</p>
                      <p className="text-sm text-gray-400 capitalize">{assessment.evaluationType} Assessment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Trust: {assessment.trustScore}</p>
                      <p className="text-sm text-gray-400">Risk: {assessment.riskScore}</p>
                    </div>
                    <Badge className={getRecommendationColor(assessment.recommendation)}>
                      {assessment.recommendation}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Notifications */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="text-[var(--cyber-cyan)] flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={onNewAssessment}
                  className="bg-[var(--cyber-cyan)] text-black font-semibold hover-glow"
                >
                  New Assessment
                </Button>
                <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                  Bulk Import
                </Button>
                <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
                  Export Reports
                </Button>
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-1">
          <Notifications />
        </div>
      </div>

      {/* AI Insights */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="text-[var(--cyber-cyan)] flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-[var(--darker-surface)] rounded-lg p-4 border-l-4 border-l-green-400">
              <h4 className="font-medium text-white mb-2">Hiring Trend Alert</h4>
              <p className="text-sm text-gray-300">
                Your hire rate has increased by 23% this month. Consider reviewing assessment criteria 
                to maintain quality standards while meeting hiring goals.
              </p>
            </div>
            
            <div className="bg-[var(--darker-surface)] rounded-lg p-4 border-l-4 border-l-yellow-400">
              <h4 className="font-medium text-white mb-2">Skill Gap Analysis</h4>
              <p className="text-sm text-gray-300">
                Recent assessments show a shortage in React/TypeScript skills. Consider updating 
                job requirements or expanding candidate sourcing strategies.
              </p>
            </div>
            
            <div className="bg-[var(--darker-surface)] rounded-lg p-4 border-l-4 border-l-blue-400">
              <h4 className="font-medium text-white mb-2">Assessment Quality Score</h4>
              <p className="text-sm text-gray-300">
                Current AI model accuracy: 94.2%. Latest updates improved emotion detection 
                by 8% and reduced false positives in risk assessment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}