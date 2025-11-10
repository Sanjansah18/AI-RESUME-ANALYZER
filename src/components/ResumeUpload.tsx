import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeUploadProps {
  onAnalysisComplete: (result: any) => void;
}

export const ResumeUpload = ({ onAnalysisComplete }: ResumeUploadProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    await analyzeResume(file);
  };

  const analyzeResume = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Read file as text
      const text = await file.text();
      
      // Call edge function for AI analysis
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText: text }
      });

      if (error) throw error;

      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed successfully",
      });
      
      onAnalysisComplete(data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-8 border-2 border-dashed border-border hover:border-primary transition-colors">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isAnalyzing}
      />
      
      <div className="flex flex-col items-center text-center space-y-4">
        {isAnalyzing ? (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Analyzing your resume...</h3>
              <p className="text-sm text-muted-foreground">
                This may take a few moments
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {fileName ? (
                <FileText className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {fileName ? fileName : "Upload your resume"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {fileName 
                  ? "Click to upload a different file" 
                  : "Drag and drop or click to upload your resume (PDF, DOC, DOCX, TXT)"}
              </p>
            </div>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="mt-4"
            >
              {fileName ? "Choose Different File" : "Choose File"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
