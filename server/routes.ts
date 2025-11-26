import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { humanizeText, batchHumanizeText } from "./openai";
import { humanizeRequestSchema, batchHumanizeRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Humanize text endpoint
  app.post("/api/humanize", async (req, res) => {
    try {
      const validation = humanizeRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error).toString();
        return res.status(400).json({ error: errorMessage });
      }

      const { text, mode, tone } = validation.data;

      const humanizedText = await humanizeText(text, mode, tone);

      // Save to history
      await storage.createHumanization({
        originalText: text,
        humanizedText,
        mode,
        tone,
      });

      res.json({ humanizedText });
    } catch (error) {
      console.error("Humanize error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to humanize text" 
      });
    }
  });

  // Batch humanize endpoint
  app.post("/api/humanize/batch", async (req, res) => {
    try {
      const validation = batchHumanizeRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error).toString();
        return res.status(400).json({ error: errorMessage });
      }

      const { texts, mode, tone } = validation.data;

      const humanizedTexts = await batchHumanizeText(texts, mode, tone);

      // Save each to history
      await Promise.all(
        texts.map((text, index) =>
          storage.createHumanization({
            originalText: text,
            humanizedText: humanizedTexts[index],
            mode,
            tone,
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

  // Get all humanization history
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getAllHumanizations();
      res.json(history);
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ error: "Failed to fetch history" });
    }
  });

  // Get single humanization by ID
  app.get("/api/history/:id", async (req, res) => {
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

  // Delete humanization from history
  app.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteHumanization(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete history error:", error);
      res.status(500).json({ error: "Failed to delete humanization" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
