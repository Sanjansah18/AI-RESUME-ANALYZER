import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, TrendingUp, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisResultsProps {
  results: {
    overallScore: number;
    atsScore: number;
    skillsScore: number;
    experienceScore: number;
    strengths: string[];
    improvements: string[];
    keywords: string[];
    suggestions: string[];
  };
  onNewAnalysis: () => void;
}

export const AnalysisResults = ({ results, onNewAnalysis }: AnalysisResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success to-accent";
    if (score >= 60) return "from-warning to-accent";
    return "from-destructive to-warning";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Overall Score Card */}
      <Card className="p-8 bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Overall Resume Score</h2>
            <p className="text-primary-foreground/80">
              Your resume has been analyzed across multiple criteria
            </p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)}`}>
              {results.overallScore}
            </div>
            <p className="text-sm opacity-80 mt-1">out of 100</p>
          </div>
        </div>
      </Card>

      {/* Detailed Scores */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">ATS Compatibility</h3>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(results.atsScore)}`}>
            {results.atsScore}%
          </div>
          <Progress value={results.atsScore} className="h-2" />
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Skills Match</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(results.skillsScore)}`}>
            {results.skillsScore}%
          </div>
          <Progress value={results.skillsScore} className="h-2" />
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Experience</h3>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(results.experienceScore)}`}>
            {results.experienceScore}%
          </div>
          <Progress value={results.experienceScore} className="h-2" />
        </Card>
      </div>

      {/* Strengths */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <h3 className="text-lg font-semibold">Strengths</h3>
        </div>
        <ul className="space-y-2">
          {results.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-success mt-2" />
              <span className="text-sm">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Areas for Improvement */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold">Areas for Improvement</h3>
        </div>
        <ul className="space-y-2">
          {results.improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-warning mt-2" />
              <span className="text-sm">{improvement}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Keywords */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Key Skills & Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {results.keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {keyword}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">AI Suggestions</h3>
        </div>
        <ul className="space-y-3">
          {results.suggestions.map((suggestion, index) => (
            <li key={index} className="p-3 bg-accent/10 rounded-lg text-sm">
              {suggestion}
            </li>
          ))}
        </ul>
      </Card>

      {/* New Analysis Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={onNewAnalysis} size="lg">
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
};
