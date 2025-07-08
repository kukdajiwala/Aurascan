import { assessments, appConfig, type Assessment, type InsertAssessment, type AppConfig } from "@shared/schema";

export interface IStorage {
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAppConfig(): Promise<AppConfig>;
  updateAppConfig(config: Partial<AppConfig>): Promise<AppConfig>;
}

export class MemStorage implements IStorage {
  private assessments: Map<number, Assessment>;
  private appConfigData: AppConfig;
  private currentId: number;

  constructor() {
    this.assessments = new Map();
    this.currentId = 1;
    this.appConfigData = {
      id: 1,
      appName: "AURASCAN",
      accentColor: "#00FFFF",
      hireLabel: "HIRE",
      reviewLabel: "REVIEW",
      rejectLabel: "REJECT",
    };
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentId++;
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAppConfig(): Promise<AppConfig> {
    return this.appConfigData;
  }

  async updateAppConfig(config: Partial<AppConfig>): Promise<AppConfig> {
    this.appConfigData = { ...this.appConfigData, ...config };
    return this.appConfigData;
  }
}

export const storage = new MemStorage();
