import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const humanizationHistory = pgTable("humanization_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalText: text("original_text").notNull(),
  humanizedText: text("humanized_text").notNull(),
  mode: varchar("mode", { length: 20 }).notNull(),
  tone: integer("tone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHumanizationHistorySchema = createInsertSchema(humanizationHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertHumanizationHistory = z.infer<typeof insertHumanizationHistorySchema>;
export type HumanizationHistory = typeof humanizationHistory.$inferSelect;

export const humanizeRequestSchema = z.object({
  text: z.string().min(1, "Text is required").max(5000, "Text must be less than 5000 characters"),
  mode: z.enum(["casual", "professional", "creative"]),
  tone: z.number().min(0).max(100).optional(),
});

export type HumanizeRequest = z.infer<typeof humanizeRequestSchema>;

export const batchHumanizeRequestSchema = z.object({
  texts: z.array(z.string().min(1).max(5000)).min(1).max(10),
  mode: z.enum(["casual", "professional", "creative"]),
  tone: z.number().min(0).max(100).optional(),
});

export type BatchHumanizeRequest = z.infer<typeof batchHumanizeRequestSchema>;
