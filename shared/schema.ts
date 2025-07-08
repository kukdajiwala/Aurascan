import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  position: text("position").notNull(),
  experience: text("experience").notNull(),
  evaluationType: text("evaluation_type").notNull(),
  resumeFilename: text("resume_filename"),
  imageFilename: text("image_filename"),
  moodScore: real("mood_score"),
  moodText: text("mood_text"),
  trustScore: real("trust_score"),
  riskScore: real("risk_score"),
  recommendation: text("recommendation"),
  reason: text("reason"),
  resumeContent: text("resume_content"),
  emotionData: text("emotion_data"),
  voiceSentiment: text("voice_sentiment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  fullName: true,
  email: true,
  position: true,
  experience: true,
  evaluationType: true,
  resumeFilename: true,
  imageFilename: true,
  moodScore: true,
  moodText: true,
  trustScore: true,
  riskScore: true,
  recommendation: true,
  reason: true,
  resumeContent: true,
  emotionData: true,
  voiceSentiment: true,
});

export const createAssessmentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().min(1, "Experience level is required"),
  evaluationType: z.enum(["mood", "trust", "risk", "final", "comprehensive"]),
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type CreateAssessmentRequest = z.infer<typeof createAssessmentSchema>;

// App configuration schema
export const appConfig = pgTable("app_config", {
  id: serial("id").primaryKey(),
  appName: text("app_name").default("AURASCAN"),
  accentColor: text("accent_color").default("#00FFFF"),
  hireLabel: text("hire_label").default("HIRE"),
  reviewLabel: text("review_label").default("REVIEW"),
  rejectLabel: text("reject_label").default("REJECT"),
});

export type AppConfig = typeof appConfig.$inferSelect;
