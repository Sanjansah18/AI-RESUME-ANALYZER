import { useState } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { FileSearch } from "lucide-react";

const Index = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
  };

  const handleNewAnalysis = () => {
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <FileSearch className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant, AI-powered insights to optimize your resume for ATS systems and recruiters
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!analysisResults ? (
            <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <AnalysisResults 
              results={analysisResults} 
              onNewAnalysis={handleNewAnalysis}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Powered by advanced AI to help you land your dream job
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
