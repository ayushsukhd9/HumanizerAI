import { type HumanizationHistory, type InsertHumanizationHistory } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import { desc, eq } from "drizzle-orm";
import ws from "ws";

// Configure Neon for WebSocket support
neonConfig.webSocketConstructor = ws;

export interface IStorage {
  // Humanization history operations
  createHumanization(data: InsertHumanizationHistory): Promise<HumanizationHistory>;
  getAllHumanizations(): Promise<HumanizationHistory[]>;
  getHumanizationById(id: string): Promise<HumanizationHistory | undefined>;
  deleteHumanization(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const pool = new Pool({ connectionString });
    this.db = drizzle(pool, { schema });
  }

  async createHumanization(data: InsertHumanizationHistory): Promise<HumanizationHistory> {
    const [result] = await this.db
      .insert(schema.humanizationHistory)
      .values(data)
      .returning();
    return result;
  }

  async getAllHumanizations(): Promise<HumanizationHistory[]> {
    return this.db
      .select()
      .from(schema.humanizationHistory)
      .orderBy(desc(schema.humanizationHistory.createdAt))
      .limit(50);
  }

  async getHumanizationById(id: string): Promise<HumanizationHistory | undefined> {
    const results = await this.db
      .select()
      .from(schema.humanizationHistory)
      .where(eq(schema.humanizationHistory.id, id))
      .limit(1);
    return results[0];
  }

  async deleteHumanization(id: string): Promise<void> {
    await this.db
      .delete(schema.humanizationHistory)
      .where(eq(schema.humanizationHistory.id, id));
  }
}

export const storage = new DbStorage();
