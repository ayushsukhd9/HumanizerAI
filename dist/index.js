var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  batchHumanizeRequestSchema: () => batchHumanizeRequestSchema,
  humanizationHistory: () => humanizationHistory,
  humanizeRequestSchema: () => humanizeRequestSchema,
  insertHumanizationHistorySchema: () => insertHumanizationHistorySchema
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var humanizationHistory = pgTable("humanization_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalText: text("original_text").notNull(),
  humanizedText: text("humanized_text").notNull(),
  mode: varchar("mode", { length: 20 }).notNull(),
  tone: integer("tone"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertHumanizationHistorySchema = createInsertSchema(humanizationHistory).omit({
  id: true,
  createdAt: true
});
var humanizeRequestSchema = z.object({
  text: z.string().min(1, "Text is required").max(5e3, "Text must be less than 5000 characters"),
  mode: z.enum(["casual", "professional", "creative"]),
  tone: z.number().min(0).max(100).optional()
});
var batchHumanizeRequestSchema = z.object({
  texts: z.array(z.string().min(1).max(5e3)).min(1).max(10),
  mode: z.enum(["casual", "professional", "creative"]),
  tone: z.number().min(0).max(100).optional()
});

// server/storage.ts
import { desc, eq } from "drizzle-orm";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var DbStorage = class {
  db;
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const pool = new Pool({ connectionString });
    this.db = drizzle(pool, { schema: schema_exports });
  }
  async createHumanization(data) {
    const [result] = await this.db.insert(humanizationHistory).values(data).returning();
    return result;
  }
  async getAllHumanizations() {
    return this.db.select().from(humanizationHistory).orderBy(desc(humanizationHistory.createdAt)).limit(50);
  }
  async getHumanizationById(id) {
    const results = await this.db.select().from(humanizationHistory).where(eq(humanizationHistory.id, id)).limit(1);
    return results[0];
  }
  async deleteHumanization(id) {
    await this.db.delete(humanizationHistory).where(eq(humanizationHistory.id, id));
  }
};
var storage = new DbStorage();

// server/openai.ts
var OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
var OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
async function humanizeText(text2, mode, tone) {
  const modePrompts = {
    casual: "Rewrite this text to sound casual, friendly, and conversational. Use everyday language, contractions, and a relaxed tone. Make it feel natural and approachable, like you're talking to a friend.",
    professional: "Rewrite this text to sound professional and polished while remaining natural. Maintain clarity and credibility, but avoid overly formal or robotic language. Strike a balance between expertise and readability.",
    creative: "Rewrite this text with creative flair and engaging language. Use vivid descriptions, varied sentence structures, and captivating word choices. Make it interesting and compelling while keeping the core message intact."
  };
  const toneInstruction = tone !== void 0 ? `

Additional tone guidance: Adjust the formality level to ${tone}% (where 0% is very casual and 100% is very formal).` : "";
  const systemPrompt = `You are an expert at humanizing AI-generated text. Your goal is to transform robotic, stilted, or overly formal text into natural, human-like writing. ${modePrompts[mode]}${toneInstruction}

Key principles:
- Maintain the original meaning and key information
- Use natural sentence flow and varied structure
- Include appropriate transitions and connectors
- Remove overly technical jargon unless necessary
- Make it sound like something a real person would write
- Keep the same approximate length`;
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }
  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://humanizer.ai",
        "X-Title": "Humanizer AI"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text2 }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to humanize text");
    }
    const data = await response.json();
    console.log("OpenRouter API response:", JSON.stringify(data, null, 2));
    const humanizedContent = data.choices?.[0]?.message?.content;
    if (!humanizedContent) {
      console.error("No content found in response. Response structure:", data);
      throw new Error("No content in API response");
    }
    console.log("Extracted humanized text:", humanizedContent);
    return humanizedContent;
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to humanize text. Please try again.");
  }
}
async function batchHumanizeText(texts, mode, tone) {
  const results = await Promise.all(
    texts.map((text2) => humanizeText(text2, mode, tone))
  );
  return results;
}

// server/routes.ts
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.post("/api/humanize", async (req, res) => {
    try {
      const validation = humanizeRequestSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error).toString();
        return res.status(400).json({ error: errorMessage });
      }
      const { text: text2, mode, tone } = validation.data;
      const humanizedText = await humanizeText(text2, mode, tone);
      await storage.createHumanization({
        originalText: text2,
        humanizedText,
        mode,
        tone
      });
      res.json({ humanizedText });
    } catch (error) {
      console.error("Humanize error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to humanize text"
      });
    }
  });
  app2.post("/api/humanize/batch", async (req, res) => {
    try {
      const validation = batchHumanizeRequestSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error).toString();
        return res.status(400).json({ error: errorMessage });
      }
      const { texts, mode, tone } = validation.data;
      const humanizedTexts = await batchHumanizeText(texts, mode, tone);
      await Promise.all(
        texts.map(
          (text2, index) => storage.createHumanization({
            originalText: text2,
            humanizedText: humanizedTexts[index],
            mode,
            tone
          })
        )
      );
      res.json({ humanizedTexts });
    } catch (error) {
      console.error("Batch humanize error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to humanize texts"
      });
    }
  });
  app2.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getAllHumanizations();
      res.json(history);
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });
  app2.get("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await storage.getHumanizationById(id);
      if (!item) {
        return res.status(404).json({ error: "Humanization not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Get history item error:", error);
      res.status(500).json({ error: "Failed to fetch humanization" });
    }
  });
  app2.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteHumanization(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete history error:", error);
      res.status(500).json({ error: "Failed to delete humanization" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
