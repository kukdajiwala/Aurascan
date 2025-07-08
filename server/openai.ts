import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ResumeAnalysis {
  skillsScore: number;
  experienceScore: number;
  qualificationsScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  moodScore: number;
  description: string;
}

interface VoiceAnalysis {
  emotion: string;
  confidence: number;
  tone: string;
  trustworthiness: number;
}

interface ComprehensiveAssessment {
  moodScore: number;
  moodText: string;
  trustScore: number;
  riskScore: number;
  recommendation: "HIRE" | "REVIEW" | "REJECT";
  reason: string;
}

export async function analyzeResume(resumeText: string, position: string, experience: string): Promise<ResumeAnalysis> {
  try {
    const prompt = `As an expert HR recruiter, analyze this resume for a ${position} position requiring ${experience} experience. 

Resume content:
${resumeText}

Provide a JSON response with:
- skillsScore (0-100): How well skills match the position
- experienceScore (0-100): How relevant the experience is
- qualificationsScore (0-100): Overall qualification level
- overallScore (0-100): Combined assessment
- strengths: Array of 3-5 key strengths
- weaknesses: Array of 2-3 areas for improvement
- summary: Brief 2-sentence professional summary

Be objective and professional. Base scores on actual content analysis.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert HR recruiter with 15+ years of experience in talent assessment. Provide honest, professional evaluations based on resume content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      skillsScore: Math.max(0, Math.min(100, result.skillsScore || 50)),
      experienceScore: Math.max(0, Math.min(100, result.experienceScore || 50)),
      qualificationsScore: Math.max(0, Math.min(100, result.qualificationsScore || 50)),
      overallScore: Math.max(0, Math.min(100, result.overallScore || 50)),
      strengths: Array.isArray(result.strengths) ? result.strengths.slice(0, 5) : ["Professional background"],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses.slice(0, 3) : ["Areas for growth"],
      summary: result.summary || "Professional candidate with relevant background."
    };
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw new Error("Failed to analyze resume with AI");
  }
}

export async function analyzeImage(imageBase64: string): Promise<EmotionAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in facial emotion analysis and behavioral psychology. Analyze facial expressions to determine emotional state, confidence level, and professional demeanor."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the facial expression and body language in this image. Provide a JSON response with:
- emotion: Primary emotion detected (confident, nervous, happy, serious, calm, anxious, etc.)
- confidence: Confidence level of the analysis (0.0-1.0)
- moodScore: Overall mood score for professional assessment (0-100, where 70+ is positive)
- description: Brief professional description of demeanor and suitability

Focus on professional traits relevant to workplace performance.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      emotion: result.emotion || "neutral",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      moodScore: Math.max(0, Math.min(100, result.moodScore || 70)),
      description: result.description || "Professional appearance with neutral demeanor."
    };
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error("Failed to analyze image with AI");
  }
}

export async function analyzeVoice(voiceText: string): Promise<VoiceAnalysis> {
  try {
    const prompt = `Analyze this voice transcription for emotional tone and trustworthiness indicators:

Voice content: "${voiceText}"

Provide JSON response with:
- emotion: Primary emotion (confident, nervous, enthusiastic, calm, hesitant, etc.)
- confidence: Analysis confidence (0.0-1.0)
- tone: Communication tone (professional, friendly, casual, formal, etc.)
- trustworthiness: Trust indicator score (0-100) based on communication style

Focus on professional communication assessment.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in voice analysis and communication assessment. Evaluate speech patterns for professional suitability."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      emotion: result.emotion || "neutral",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      tone: result.tone || "professional",
      trustworthiness: Math.max(0, Math.min(100, result.trustworthiness || 70))
    };
  } catch (error) {
    console.error("Voice analysis error:", error);
    throw new Error("Failed to analyze voice with AI");
  }
}

export async function generateComprehensiveAssessment(
  resumeAnalysis: ResumeAnalysis,
  emotionAnalysis: EmotionAnalysis,
  voiceAnalysis?: VoiceAnalysis,
  candidateName: string,
  position: string
): Promise<ComprehensiveAssessment> {
  try {
    const voiceInfo = voiceAnalysis ? 
      `Voice Analysis: ${voiceAnalysis.emotion} emotion, ${voiceAnalysis.tone} tone, trustworthiness: ${voiceAnalysis.trustworthiness}/100` :
      "No voice analysis available";

    const prompt = `As a senior HR director, provide a comprehensive hiring assessment for ${candidateName} applying for ${position}.

Resume Analysis:
- Overall Score: ${resumeAnalysis.overallScore}/100
- Skills Score: ${resumeAnalysis.skillsScore}/100
- Experience Score: ${resumeAnalysis.experienceScore}/100
- Strengths: ${resumeAnalysis.strengths.join(", ")}
- Weaknesses: ${resumeAnalysis.weaknesses.join(", ")}

Emotion Analysis:
- Detected Emotion: ${emotionAnalysis.emotion}
- Mood Score: ${emotionAnalysis.moodScore}/100
- Confidence: ${emotionAnalysis.confidence}

${voiceInfo}

Provide a JSON response with:
- moodScore: Final mood/emotional stability score (0-100)
- moodText: Primary emotional state description
- trustScore: Overall trustworthiness score (0-100)
- riskScore: Risk assessment score (0-100, higher = more risk)
- recommendation: "HIRE", "REVIEW", or "REJECT"
- reason: 2-3 sentence explanation for the recommendation

Consider all factors holistically for professional hiring decision.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior HR director with 20+ years of experience making hiring decisions. Provide balanced, fair assessments based on professional criteria."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      moodScore: Math.max(0, Math.min(100, result.moodScore || emotionAnalysis.moodScore)),
      moodText: result.moodText || emotionAnalysis.emotion,
      trustScore: Math.max(0, Math.min(100, result.trustScore || 70)),
      riskScore: Math.max(0, Math.min(100, result.riskScore || 30)),
      recommendation: ["HIRE", "REVIEW", "REJECT"].includes(result.recommendation) ? result.recommendation : "REVIEW",
      reason: result.reason || "Comprehensive assessment completed based on available data."
    };
  } catch (error) {
    console.error("Comprehensive assessment error:", error);
    throw new Error("Failed to generate comprehensive assessment");
  }
}