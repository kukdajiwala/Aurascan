import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createAssessmentSchema, insertAssessmentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import natural from "natural";
import axios from "axios";
import pdfParse from "pdf-parse";
import { 
  analyzeResume, 
  analyzeImage, 
  analyzeVoice, 
  generateComprehensiveAssessment 
} from "./openai";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "resume") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Resume must be a PDF file"));
      }
    } else if (file.fieldname === "image") {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Image must be a valid image file"));
      }
    } else if (file.fieldname === "audio") {
      if (file.mimetype.startsWith("audio/") || file.mimetype.includes("webm")) {
        cb(null, true);
      } else {
        cb(new Error("Audio must be a valid audio file"));
      }
    } else {
      cb(new Error("Unexpected field"));
    }
  },
});

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

interface ProcessingResult {
  moodScore: number;
  moodText: string;
  trustScore: number;
  riskScore: number;
  recommendation: string;
  reason: string;
  resumeContent?: string;
  emotionData?: string;
}

async function extractResumeContent(filePath: string): Promise<string> {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text || "Unable to extract text from PDF";
  } catch (error) {
    console.error("Error extracting PDF content:", error);
    throw new Error("Failed to extract resume content");
  }
}

async function convertImageToBase64(imagePath: string): Promise<string> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Failed to process image");
  }
}

// Process voice recording if provided
async function processVoiceRecording(audioFile?: Express.Multer.File): Promise<any> {
  if (!audioFile) return null;
  
  try {
    // For now, simulate voice analysis since audio transcription requires additional setup
    // In production, you would use OpenAI Whisper API to transcribe audio first
    const mockTranscript = "I am excited about this opportunity and look forward to contributing to your team.";
    return await analyzeVoice(mockTranscript);
  } catch (error) {
    console.error("Voice processing error:", error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get app configuration
  app.get("/api/config", async (req, res) => {
    try {
      const config = await storage.getAppConfig();
      res.json(config);
    } catch (error) {
      console.error("Error fetching config:", error);
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  // Update app configuration
  app.post("/api/config", async (req, res) => {
    try {
      const config = await storage.updateAppConfig(req.body);
      res.json(config);
    } catch (error) {
      console.error("Error updating config:", error);
      res.status(500).json({ message: "Failed to update configuration" });
    }
  });

  // Submit assessment
  app.post("/api/assessment", upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]), async (req, res) => {
    try {
      // Validate request body
      const validatedData = createAssessmentSchema.parse(req.body);
      
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.resume || !files.image) {
        return res.status(400).json({ message: "Both resume and image files are required" });
      }

      const resumeFile = files.resume[0];
      const imageFile = files.image[0];

      // Extract resume content
      const resumeContent = await extractResumeContent(resumeFile.path);
      
      // Convert image to base64 for OpenAI analysis
      const imageBase64 = await convertImageToBase64(imageFile.path);
      
      // Process voice sentiment if provided
      const voiceSentiment = req.body.voiceSentiment ? JSON.parse(req.body.voiceSentiment) : null;
      
      // Perform AI analysis using OpenAI
      const resumeAnalysis = await analyzeResume(resumeContent, validatedData.position, validatedData.experience);
      const emotionAnalysis = await analyzeImage(imageBase64);
      
      // Generate comprehensive assessment
      const aiAssessment = await generateComprehensiveAssessment(
        resumeAnalysis,
        emotionAnalysis,
        voiceSentiment,
        validatedData.fullName,
        validatedData.position
      );
      
      // Create assessment record
      const assessmentData = {
        ...validatedData,
        resumeFilename: resumeFile.originalname,
        imageFilename: imageFile.originalname,
        resumeContent,
        emotionData: JSON.stringify(emotionAnalysis),
        voiceSentiment: voiceSentiment ? JSON.stringify(voiceSentiment) : null,
        ...aiAssessment,
      };

      const assessment = await storage.createAssessment(assessmentData);

      // Clean up uploaded files
      fs.unlinkSync(resumeFile.path);
      fs.unlinkSync(imageFile.path);

      res.json(assessment);
    } catch (error) {
      console.error("Error processing assessment:", error);
      
      // Clean up files on error
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        Object.values(files).flat().forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to process assessment" });
      }
    }
  });

  // Get assessment by ID
  app.get("/api/assessment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
