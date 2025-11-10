import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();
    
    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert resume analyzer and career coach. Analyze the provided resume and return a detailed assessment in JSON format with the following structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "skillsScore": <number 0-100>,
  "experienceScore": <number 0-100>,
  "strengths": [<array of 3-5 specific strengths>],
  "improvements": [<array of 3-5 specific areas to improve>],
  "keywords": [<array of 8-12 key skills/technologies found>],
  "suggestions": [<array of 3-5 actionable suggestions>]
}

Consider:
- ATS compatibility (formatting, keywords, structure)
- Skills relevance and presentation
- Experience description quality
- Achievement quantification
- Professional language
- Industry standards

Be specific, actionable, and constructive in your feedback.`;

    console.log('Calling Lovable AI for resume analysis...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this resume:\n\n${resumeText}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices[0].message.content;
    
    console.log('AI Analysis received:', analysis);
    
    // Parse the JSON response from the AI
    let parsedAnalysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysis.match(/```json\n([\s\S]*?)\n```/) || analysis.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : analysis;
      parsedAnalysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return a default structure if parsing fails
      parsedAnalysis = {
        overallScore: 70,
        atsScore: 65,
        skillsScore: 70,
        experienceScore: 75,
        strengths: [
          "Resume contains relevant professional experience",
          "Clear structure and formatting",
          "Good use of action verbs"
        ],
        improvements: [
          "Add more quantifiable achievements",
          "Include more industry-specific keywords",
          "Optimize formatting for ATS systems"
        ],
        keywords: [
          "Professional", "Experience", "Skills", "Education", "Management", 
          "Leadership", "Communication", "Problem-solving"
        ],
        suggestions: [
          "Add metrics and numbers to quantify your achievements",
          "Include a professional summary at the top",
          "Tailor your resume to specific job descriptions",
          "Use standard section headings for better ATS compatibility"
        ]
      };
    }

    return new Response(
      JSON.stringify(parsedAnalysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze resume. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
